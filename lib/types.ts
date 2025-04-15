import {
  CreatorApplicationPaymentMethod,
  LicenseType,
  PaymentProvider,
  Prisma,
} from '@prisma/client'

export enum OAuthProviders {
  GOOGLE = 'google',
  GITHUB = 'github',
  TWITTER = 'twitter',
}

export enum USER_TYPES {
  ADMIN = 'admin',
  USER = 'user',
}

export interface LicenseOption {
  id: string
  licenseId: LicenseType
  name: string
  description: string
  features: string[]
  price: number
}

export interface Pagination {
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type ExploreAsset = Prisma.AssetGetPayload<{
  include: {
    category: true
    creator: {
      include: {
        user: true
      }
    }
  }
}>

export interface CartItem {
  assetId: string
  assetLicenseId: LicenseType
  title: string
  price: number
  licenseName: string
  image: string
}

export type CheckoutCreatorsData = Record<
  PaymentProvider,
  CheckoutPaymentDetails[]
>
export type CheckoutPaymentDetails = Pick<
  CreatorApplicationPaymentMethod,
  'accountIdentifier' | 'creatorProfileId'
>

export interface Cart {
  items: CartItem[]
  total: number
}

export interface CartContextType {
  cart: Cart
  addToCart: (item: CartItem) => Promise<void>
  removeItem: (assetId: string, licenseId: LicenseType) => Promise<void>
  clearCart: () => Promise<void>
  totalItems: number
  totalPrice: number
  isLoading: boolean
}

export enum CartContextActionType {
  ADD_ITEM = 'ADD_ITEM',
  REMOVE_ITEM = 'REMOVE_ITEM',
  CLEAR_CART = 'CLEAR_CART',
}
