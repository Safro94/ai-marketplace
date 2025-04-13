'use client'

import {
  addItemToCart,
  clearCartItems,
  getCartItems,
  getCartTotalPrice,
  removeItemFromCart,
} from '@/actions/cart'
import { CartItem } from '@/lib/types'
import { LicenseType } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export function useCart() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cartTotal, setCartTotal] = useState(0)

  // Fetch cart on component mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true)
        const items = await getCartItems()
        setCart(items)

        const total = await getCartTotalPrice()
        setCartTotal(total)
      } catch (error) {
        console.error('Error fetching cart:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [])

  // Add item to cart
  const addToCart = useCallback(
    async (item: CartItem) => {
      try {
        setIsLoading(true)
        const updatedCart = await addItemToCart(item)
        setCart(updatedCart)

        const total = await getCartTotalPrice()
        setCartTotal(total)

        router.refresh()
        return true
      } catch (error) {
        console.error('Error adding item to cart:', error)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  // Remove item from cart
  const removeItem = useCallback(
    async (assetId: string, licenseId: LicenseType) => {
      try {
        setIsLoading(true)
        const updatedCart = await removeItemFromCart(assetId, licenseId)
        setCart(updatedCart)

        const total = await getCartTotalPrice()
        setCartTotal(total)

        router.refresh()
        return true
      } catch (error) {
        console.error('Error removing item from cart:', error)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true)
      await clearCartItems()
      setCart([])
      setCartTotal(0)

      router.refresh()
      return true
    } catch (error) {
      console.error('Error clearing cart:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [router])

  return {
    cart,
    isLoading,
    cartTotal,
    addToCart,
    removeItem,
    clearCart,
  }
}
