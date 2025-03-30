export const ROUTES = {
  home: () => '/',
  privacy: () => '/privacy',
  terms: () => '/terms',
  login: () => '/login',
  signUp: () => '/signup',
  about: () => '/about',
  contact: () => '/contact',
  resetPassword: () => '/reset-password',
  dashboard: () => '/dashboard',
  assets: () => '/assets',
  assetsDetail: (id: string) => `/assets/${id}`,
  account: () => '/account',
  purchases: () => '/purchases',
  cart: () => '/cart',
  explore: () => '/explore',
  categories: () => '/categories',
  creators: () => '/creators',
  creatorsThankYou: () => '/creators/thank-you',
  creatorsApply: () => '/creators/apply',
  creatorTerms: () => '/creators/terms',
  creatorFAQ: () => '/creator-faq',
  creatorDashboard: () => '/creator-dashboard',
  creatorDashboardUpload: () => '/creator-dashboard/upload',
  creatorDashboardThankYou: () => '/creator-dashboard/thank-you',
  admin: () => '/admin',
  adminUsers: () => '/admin/users',
  adminAssets: () => '/admin/assets',
  adminCreatorApplications: () => '/admin/creator-applications',
  adminAnalytics: () => '/admin/analytics',
  adminSettings: () => '/admin/settings',
}

export const API_ROUTES = {
  adminCreatorApplications: () => '/api/admin/creator-applications',
  userProfile: () => '/api/user/profile',
  assetDownload: (assetId: string) => `/api/assets/${assetId}/download`,
  licenses: () => '/api/licenses',
  assetsUpload: () => '/api/assets/upload',
  assetsLicenses: (assetId: string) => `/api/assets/${assetId}/licenses`,
  assetsReview: (assetId: string) => `/api/assets/${assetId}/reviews`,
  assetAdminModeration: (assetId: string) => `/api/admin/assets/${assetId}`,
  assetAdminFeature: (assetId: string) =>
    `/api/admin/assets/${assetId}/feature`,
  creatorsApply: () => '/api/creators/apply',
  favorites: () => '/api/favorites',
}

export const EMAIL_FROM = `AI Assets <${process.env.NEXT_PUBLIC_RESEND_EMAIL}>`
export const PAYPAL_EMAIL = process.env.NEXT_PUBLIC_PAYPAL_EMAIL
export const SUPPORT_EMAIL = 'support@aiassetsmarketplace.com'
export const INFO_EMAIL = 'info@aiassetsmarketplace.com'
export const PRIVACY_EMAIL = 'privacy@aiassetsmarketplace.com'

export const HEADER_LINKS = [
  { name: 'Home', href: ROUTES.home() },
  { name: 'Explore', href: ROUTES.explore() },
  { name: 'Categories', href: ROUTES.categories() },
  { name: 'For Creators', href: ROUTES.creators() },
]

export enum EXPLORE_PARAMS {
  CATEGORY = 'category',
  USE_CASES = 'useCase',
  MIN_RATING = 'minRating',
  MIN_PRICE = 'minPrice',
  SORT_BY = 'sortBy',
  PAGE = 'page',
}

export enum EXPLORE_FITLERS {
  CATEGORIES = 'categories',
  PRICE = 'price',
  USE_CASES = 'use-cases',
  RATINGS = 'ratings',
}

export enum LICENSE_TYPE {
  STANDARD = 'standard-license',
  EXTENDED = 'extended-license',
}
