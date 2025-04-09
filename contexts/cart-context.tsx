'use client'

import { toast } from '@/components/ui/toast'
import { CartContextType, CartItem } from '@/lib/types'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    // Check if the asset is already in the cart
    const existingItemIndex = items.findIndex((i) => i.assetId === item.assetId)

    if (existingItemIndex >= 0) {
      // Replace the existing item (might be a different license)
      const newItems = [...items]
      newItems[existingItemIndex] = item
      setItems(newItems)

      toast.success('Cart updated', {
        description: `Updated ${item.title}`,
      })
    } else {
      // Add new item
      setItems([...items, item])

      toast.success('Added to cart', {
        description: `${item.title} added to your cart`,
      })
    }
  }

  const removeItem = (assetId: string, title: string) => {
    // Check if the asset is already in the cart
    const existingItem = items.find((i) => i.assetId === assetId)

    if (existingItem) {
      const newItems = items.filter((i) => i.assetId !== assetId)
      setItems(newItems)

      toast.success('Cart updated', {
        description: `${title} has been removed from your cart`,
      })
    } else {
      toast.success('Item not found')
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.length
  const totalPrice = items.reduce((total, item) => total + item.price, 0)

  return (
    <CartContext.Provider
      value={{
        isLoading,
        items,
        addItem,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
