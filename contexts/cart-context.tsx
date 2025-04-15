'use client'

import {
  addItemToCart,
  clearCartItems,
  getCartItems,
  getCartTotalPrice,
  removeItemFromCart,
} from '@/actions/cart'
import { Cart, CartContextType, CartItem } from '@/lib/types'
import { LicenseType } from '@prisma/client'
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true)
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
  })

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

  const addToCart = useCallback(async (item: CartItem) => {
    try {
      setIsLoading(true)
      const { updatedCart, cartTotal } = await addItemToCart(item)
      setCart({ items: updatedCart, total: cartTotal })
    } catch (error) {
      console.error('Error adding item to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const removeItem = useCallback(
    async (assetId: string, licenseId: LicenseType) => {
      try {
        setIsLoading(true)
        const { updatedCart, cartTotal } = await removeItemFromCart(
          assetId,
          licenseId,
        )

        setCart({ items: updatedCart, total: cartTotal })
      } catch (error) {
        console.error('Error removing item from cart:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true)
      await clearCartItems()
      setCart({ items: [], total: 0 })
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const totalPrice = useMemo(
    () => cart.items.reduce((total, item) => total + item.price, 0),
    [cart.items],
  )

  return useMemo(() => {
    return (
      <CartContext.Provider
        value={{
          cart,
          isLoading,
          addToCart,
          removeItem,
          clearCart,
          totalItems: cart.items.length,
          totalPrice,
        }}
      >
        {children}
      </CartContext.Provider>
    )
  }, [addToCart, cart, children, clearCart, isLoading, removeItem, totalPrice])
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
