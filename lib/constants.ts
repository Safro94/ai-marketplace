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
  checkout: () => '/checkout',
  checkoutSuccess: () => '/checkout/success',
  explore: () => '/explore',
  creators: () => '/creators',
  creatorsThankYou: () => '/creators/thank-you',
  creatorsApply: () => '/creators/apply',
  creatorTerms: () => '/creators/terms',
  creatorFAQ: () => '/creators/faq',
  creatorDashboard: () => '/creator-dashboard',
  creatorDashboardUpload: () => '/creator-dashboard/upload',
  creatorDashboardAssetEdit: (assetId: string) =>
    `/creator-dashboard/assets/${assetId}/edit`,
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
  licenses: () => '/api/licenses',
  assets: () => '/api/assets',
  assetsUpload: () => '/api/assets/upload',
  assetsDownload: () => `/api/assets/download`,
  asset: (assetId: string) => `/api/assets/${assetId}`,
  assetsLicenses: (assetId: string) => `/api/assets/${assetId}/licenses`,
  assetsReview: (assetId: string) => `/api/assets/${assetId}/reviews`,
  assetAdminModeration: (assetId: string) => `/api/admin/assets/${assetId}`,
  assetAdminFeature: (assetId: string) =>
    `/api/admin/assets/${assetId}/feature`,
  creatorsApply: () => '/api/creators/apply',
  favorites: () => '/api/favorites',
  notifications: () => '/api/notifications',
  notificationsReadAll: () => '/api/notifications/read-all',
  notificationRead: (id: string) => `/api/notifications/${id}/read`,
  purchase: () => '/api/purchases',
  checkout: () => '/api/checkout',
}

export const CACHE_KEYS = {
  profile: (userId: string) => `profile-${userId}`,
}

export const WS_EVENTS = {
  NEW_NOTIFICATION: 'NEW_NOTIFICATION',
}

export const EMAIL_FROM = `AI Assets <${process.env.NEXT_PUBLIC_RESEND_EMAIL}>`
export const PAYPAL_EMAIL = process.env.NEXT_PUBLIC_PAYPAL_EMAIL
export const SUPPORT_EMAIL = 'support@aiassetsmarketplace.com'
export const INFO_EMAIL = 'info@aiassetsmarketplace.com'
export const PRIVACY_EMAIL = 'privacy@aiassetsmarketplace.com'
export const BIO_MAX_LENGTH = 500
export const SERVICE_CHARGE = 0.25
export const FIXED_TRANSACTION_FEE = 0.3
export const CART_COOKIE_NAME = 'cart_session_id'
export const CART_EXPIRY = 60 * 60 * 24 * 30 // 30 days in seconds

export const HEADER_LINKS = [
  { name: 'Home', href: ROUTES.home() },
  { name: 'Explore', href: ROUTES.explore() },
  { name: 'For Creators', href: ROUTES.creators() },
]

export enum EXPLORE_PARAMS {
  CATEGORY = 'category',
  USE_CASES = 'useCase',
  MIN_RATING = 'minRating',
  MIN_PRICE = 'minPrice',
  SORT_BY = 'sortBy',
  PAGE = 'page',
  QUERY = 'q',
}

export enum EXPLORE_FITLERS {
  CATEGORIES = 'categories',
  PRICE = 'price',
  USE_CASES = 'use-cases',
  RATINGS = 'ratings',
}
