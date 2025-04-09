import {
  Asset,
  Category,
  CreatorApplicationPaymentMethod,
  LicenseType,
  PaymentProvider,
  Profile,
  User,
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
  licenseId: string
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

export interface ExploreAsset extends Asset {
  category: Category
  creator: Profile & {
    user: User
  }
}

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

export interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (assetId: string, title: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isLoading: boolean
}
