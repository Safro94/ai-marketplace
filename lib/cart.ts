import { LicenseType } from '@prisma/client'
import { cookies } from 'next/headers'
import { CART_COOKIE_NAME, CART_EXPIRY } from './constants'
import redis from './redis'
import { CartItem } from './types'

// Get cart key for Redis
const getCartKey = async () => {
  const sessionId = await getCartSessionCookie()
  return `cart:${sessionId}`
}

// get cart session cookie or create one
const getCartSessionCookie = async () => {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(CART_COOKIE_NAME)!.value
  return sessionId
}

// Get cart items
export const getCart = async () => {
  try {
    const cartKey = await getCartKey()
    const cart = await redis.get<CartItem[]>(cartKey)

    return cart || []
  } catch (error) {
    console.error('Error getting cart:', error)
    return []
  }
}

// Add item to cart
export const addToCart = async (item: CartItem) => {
  try {
    const cartKey = await getCartKey()
    const cart = await getCart()

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
      (cartItem) =>
        cartItem.assetId === item.assetId &&
        cartItem.assetLicenseId === item.assetLicenseId,
    )

    if (existingItemIndex >= 0) {
      // Replace the existing item (might be a different license)
      cart[existingItemIndex] = item
    } else {
      // Add new item
      cart.push(item)
    }

    // Save cart to Redis with expiry
    await redis.set(cartKey, cart, { ex: CART_EXPIRY })

    return cart
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

// Remove item from cart
export const removeFromCart = async (
  assetId: string,
  licenseId: LicenseType,
) => {
  try {
    const cartKey = await getCartKey()
    const cart = await getCart()

    const existingItemIndex = cart.findIndex(
      (item) => item.assetId === assetId && item.assetLicenseId === licenseId,
    )

    if (existingItemIndex >= 0) {
      const newCart = cart.filter((i) => i.assetId !== assetId)
      await redis.set(cartKey, newCart, { ex: CART_EXPIRY })
      return newCart
    }

    return cart
  } catch (error) {
    console.error('Error updating cart item:', error)
    throw error
  }
}

// Clear cart
export const clearCart = async () => {
  try {
    const cartKey = await getCartKey()
    await redis.del(cartKey)
  } catch (error) {
    console.error('Error clearing cart:', error)
    throw error
  }
}

// Get cart total
export const getCartTotal = async () => {
  const cart = await getCart()
  return cart.reduce((total, item) => total + item.price, 0)
}

// Get cart item count
export const getCartItemCount = async () => {
  const cart = await getCart()
  return cart.length
}
