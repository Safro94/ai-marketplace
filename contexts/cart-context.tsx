'use client'

import { toast } from '@/components/ui/toast'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type CartItem = {
  assetId: string
  assetLicenseId: string
  title: string
  price: number
  licenseName: string
  image: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (assetLicenseId: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
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
        description: `Updated license for ${item.title}`,
      })
    } else {
      // Add new item
      setItems([...items, item])

      toast.success('Added to cart', {
        description: `${item.title} added to your cart`,
      })
    }
  }

  const removeItem = (assetLicenseId: string) => {
    const newItems = items.filter(
      (item) => item.assetLicenseId !== assetLicenseId,
    )
    setItems(newItems)
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.length
  const totalPrice = items.reduce((total, item) => total + item.price, 0)

  return (
    <CartContext.Provider
      value={{
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
