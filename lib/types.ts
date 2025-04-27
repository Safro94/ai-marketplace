import {
  CreatorApplicationPaymentMethod,
  LicenseType,
  PaymentProvider,
  Prisma,
} from '@prisma/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncReturnType<T extends (..._args: any) => Promise<any>> =
  Awaited<ReturnType<T>>

export enum OAuthProviders {
  GOOGLE = 'google',
  GITHUB = 'github',
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
    category: {
      select: {
        name: true
      }
    }
    creator: {
      select: {
        user: {
          select: {
            name: true
            image: true
          }
        }
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

export interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => Promise<void>
  removeItem: (assetId: string, licenseId: LicenseType) => Promise<void>
  clearCart: () => Promise<void>
  totalItems: number
  isLoading: boolean
}

export enum CartContextActionType {
  ADD_ITEM = 'ADD_ITEM',
  REMOVE_ITEM = 'REMOVE_ITEM',
  CLEAR_CART = 'CLEAR_CART',
}

export enum EXPLORE_PARAMS {
  CATEGORY = 'category',
  USE_CASES = 'useCase',
  MIN_RATING = 'minRating',
  MIN_PRICE = 'minPrice',
  SORT_BY = 'sortBy',
  PAGE = 'page',
  QUERY = 'q',
}

export enum EXPLORE_SORT_BY {
  FEATURED = 'featured',
  PRICE_LOW = 'price-low',
  PRICE_HIGH = 'price-high',
  RATING = 'rating',
  NEWEST = 'newest',
}

export interface ExploreFilters {
  sort: EXPLORE_SORT_BY
  priceRange: number[]
  rating: number[]
}

export type CreatorDashboardAssetWithAnalytics = Prisma.AssetGetPayload<{
  include: {
    assetAnalytics: {
      select: {
        views: true
      }
    }
  }
}>
