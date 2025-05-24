import {
  CreatorApplicationPaymentMethod,
  LicenseType,
  PaymentProvider,
  PrimaryMediaType,
  Prisma,
} from '@prisma/client'
import * as LucideIcons from 'lucide-react'

type LucideIconName = keyof typeof LucideIcons
export type Unpacked<T> = T extends (infer U)[] ? U : T

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
  select: {
    id: true
    featuredImage: true
    galleryImages: true
    title: true
    averageRating: true
    totalReviews: true
    basePrice: true
    primaryMediaType: true

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
  primaryMedia: string
  primaryMediaType: PrimaryMediaType
}

export type CheckoutCreatorsData = Record<
  PaymentProvider,
  CheckoutPaymentDetails[]
>
export type CheckoutPaymentDetails = Pick<
  CreatorApplicationPaymentMethod,
  'accountIdentifier' | 'creatorProfileId'
>

export interface AffiliateCodeContext {
  code: string | undefined
  discount: number | undefined | null
}

export interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => Promise<void>
  removeItem: (assetId: string, licenseId: LicenseType) => Promise<void>
  clearCart: () => Promise<void>
  totalItems: number
  isLoading: boolean
  affiliateCode: AffiliateCodeContext | undefined
  addOrClearAffiliateCode: (affiliateCode?: AffiliateCodeContext) => void
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
  FREE = 'free',
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
  free: boolean
}

export type CreatorDashboardAssetWithAnalytics = Prisma.AssetGetPayload<{
  select: {
    id: true
    title: true
    status: true
    revenue: true
    createdAt: true
    totalReviews: true
    averageRating: true
    featuredImage: true
    moderationNotes: true
    primaryMediaType: true

    assetAnalytics: {
      select: {
        uniqueViews: true
      }
    }
  }
}>

export interface InfiniteRoute {
  profileId: string
  limit: number
  offset: number
}

export type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; assetId: string; licenseId: LicenseType }
  | { type: 'CLEAR_CART' }

export interface SidebarLink {
  name: string
  href: string
  icon: LucideIconName
  match: string
}
