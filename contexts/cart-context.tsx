'use client'

import {
  addItemToCart,
  clearCartItems,
  getCartItems,
  removeItemFromCart,
} from '@/actions/cart'
import { useAuth } from '@/hooks/use-auth'
import {
  AffiliateCodeContext,
  CartAction,
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

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [affiliateCode, setAffiliateCode] = useState<
    AffiliateCodeContext | undefined
  >()

  // Set up optimistic updates with useOptimistic
  const [optimisticCart, addOptimisticCartUpdate] = useOptimistic(
    cart,
    (state, action: CartAction) => {
      switch (action.type) {
        case CartContextActionType.ADD_ITEM: {
          const newItem = action.item as CartItem
          const updatedItems = [...state]

          // Check if item already exists in cart
          const existingItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.assetId === newItem.assetId,
          )

          if (existingItemIndex >= 0) {
            // Replace the existing item (might be a different license)
            updatedItems[existingItemIndex] = newItem
          } else {
            updatedItems.push(newItem)
          }

          return updatedItems
        }
        case CartContextActionType.REMOVE_ITEM: {
          const { assetId, licenseId } = action

          const updatedItems = state.filter(
            (item) =>
              !(item.assetId === assetId && item.assetLicenseId === licenseId),
          )
          return updatedItems
        }
        case CartContextActionType.CLEAR_CART:
          return []
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
        setCart(items)
      } catch (error) {
        console.error('Error fetching cart:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) fetchCart()
  }, [user])

  const addToCart = useCallback(
    async (item: CartItem) => {
      // Apply optimistic update first
      addOptimisticCartUpdate({ type: CartContextActionType.ADD_ITEM, item })

      try {
        setIsLoading(true)

        const { updatedCart } = await addItemToCart(item)
        setCart(updatedCart)
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
        const { updatedCart } = await removeItemFromCart(assetId, licenseId)

        setCart(updatedCart)
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
      setCart([])
    } catch (error) {
      console.error('Error clearing cart:', error)
      // Trigger reversion of optimistic update
      setCart((currentCart) => ({ ...currentCart }))
    } finally {
      setIsLoading(false)
    }
  }, [addOptimisticCartUpdate])

  const addOrClearAffiliateCode = useCallback(
    (affiliateCode?: AffiliateCodeContext) => {
      setAffiliateCode(affiliateCode)
    },
    [setAffiliateCode],
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
          affiliateCode,
          addOrClearAffiliateCode,
          totalItems: optimisticCart.length,
        }}
      >
        {children}
      </CartContext.Provider>
    )
  }, [
    optimisticCart,
    isLoading,
    addToCart,
    removeItem,
    clearCart,
    affiliateCode,
    addOrClearAffiliateCode,
    children,
  ])
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
