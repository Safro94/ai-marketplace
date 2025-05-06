'use server'

import {
  addToCart,
  clearCart,
  getCart,
  getCartItemCount,
  getCartTotal,
  removeFromCart,
} from '@/lib/cart'
import { ROUTES } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { CartItem } from '@/lib/types'
import { LicenseType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// Get cart items
export const getCartItems = async () => {
  return getCart()
}

// Add item to cart
export const addItemToCart = async (item: CartItem) => {
  await validateSession()
  const updatedCart = await addToCart(item)
  const cartTotal = await getCartTotal()
  revalidatePath(ROUTES.cart())

  return { updatedCart, cartTotal }
}

// Remove item from cart
export const removeItemFromCart = async (
  assetId: string,
  licenseId: LicenseType,
) => {
  await validateSession()
  const updatedCart = await removeFromCart(assetId, licenseId)
  const cartTotal = await getCartTotal()
  revalidatePath(ROUTES.cart())

  return { updatedCart, cartTotal }
}

// Clear cart
export const clearCartItems = async () => {
  await validateSession()
  await clearCart()
  revalidatePath(ROUTES.cart())
}

// Get cart total
export const getCartTotalPrice = async () => {
  await validateSession()
  return getCartTotal()
}

// Get cart item count
export const getCartItemsCount = async () => {
  await validateSession()
  return getCartItemCount()
}
