import { Asset, Category, Profile, User } from '@prisma/client'

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
