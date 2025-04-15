'use client'

import {
  addItemToCart,
  clearCartItems,
  getCartItems,
  getCartTotalPrice,
  removeItemFromCart,
} from '@/actions/cart'
import {
  Cart,
  CartContextActionType,
  CartContextType,
  CartItem,
} from '@/lib/types'
import { LicenseType } from '@prisma/client'
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
} from 'react'

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; assetId: string; licenseId: LicenseType }
  | { type: 'CLEAR_CART' }

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true)
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
  })

  // Set up optimistic updates with useOptimistic

  const [optimisticCart, addOptimisticCartUpdate] = useOptimistic(
    cart,
    (state, action: CartAction) => {
      switch (action.type) {
        case CartContextActionType.ADD_ITEM: {
          const newItem = action.item as CartItem
          const updatedItems = [...state.items, newItem]
          return {
            items: updatedItems,
            total: state.total + newItem.price,
          }
        }
        case CartContextActionType.REMOVE_ITEM: {
          const { assetId, licenseId } = action
          const itemToRemove = state.items.find(
            (item) =>
              item.assetId === assetId && item.assetLicenseId === licenseId,
          )
          const priceToSubtract = itemToRemove?.price || 0
          const updatedItems = state.items.filter(
            (item) =>
              !(item.assetId === assetId && item.assetLicenseId === licenseId),
          )
          return {
            items: updatedItems,
            total: state.total - priceToSubtract,
          }
        }
        case CartContextActionType.CLEAR_CART:
          return {
            items: [],
            total: 0,
          }
        default:
          return state
      }
    },
  )

  // Load cart from localStorage on initial render
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await getCartItems()
        const total = await getCartTotalPrice()
        setCart({ items, total })
      } catch (error) {
        console.error('Error fetching cart:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [])

  const addToCart = useCallback(
    async (item: CartItem) => {
      // Apply optimistic update first
      addOptimisticCartUpdate({ type: CartContextActionType.ADD_ITEM, item })

      try {
        setIsLoading(true)
        const { updatedCart, cartTotal } = await addItemToCart(item)
        setCart({ items: updatedCart, total: cartTotal })
      } catch (error) {
        console.error('Error adding item to cart:', error)
        // The useOptimistic hook will automatically revert to the previous state
        // when the base state is updated without changes
        setCart((currentCart) => ({ ...currentCart }))
      } finally {
        setIsLoading(false)
      }
    },
    [addOptimisticCartUpdate],
  )

  const removeItem = useCallback(
    async (assetId: string, licenseId: LicenseType) => {
      // Apply optimistic update first
      addOptimisticCartUpdate({
        type: CartContextActionType.REMOVE_ITEM,
        assetId,
        licenseId,
      })

      try {
        setIsLoading(true)
        const { updatedCart, cartTotal } = await removeItemFromCart(
          assetId,
          licenseId,
        )

        setCart({ items: updatedCart, total: cartTotal })
      } catch (error) {
        console.error('Error removing item from cart:', error)
        // Trigger reversion of optimistic update
        setCart((currentCart) => ({ ...currentCart }))
      } finally {
        setIsLoading(false)
      }
    },
    [addOptimisticCartUpdate],
  )

  const clearCart = useCallback(async () => {
    // Apply optimistic update first
    addOptimisticCartUpdate({ type: CartContextActionType.CLEAR_CART })

    try {
      setIsLoading(true)
      await clearCartItems()
      setCart({ items: [], total: 0 })
    } catch (error) {
      console.error('Error clearing cart:', error)
      // Trigger reversion of optimistic update
      setCart((currentCart) => ({ ...currentCart }))
    } finally {
      setIsLoading(false)
    }
  }, [addOptimisticCartUpdate])

  const totalPrice = useMemo(
    () => optimisticCart.items.reduce((total, item) => total + item.price, 0),
    [optimisticCart.items],
  )

  return useMemo(() => {
    return (
      <CartContext.Provider
        value={{
          cart: optimisticCart,
          isLoading,
          addToCart,
          removeItem,
          clearCart,
          totalItems: optimisticCart.items.length,
          totalPrice,
        }}
      >
        {children}
      </CartContext.Provider>
    )
  }, [
    addToCart,
    optimisticCart,
    children,
    clearCart,
    isLoading,
    removeItem,
    totalPrice,
  ])
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
