export const ROUTES = {
  home: () => '/',
  blocked: () => '/blocked',
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
  creatorDashboardAssets: () => '/creator-dashboard/assets',
  creatorDashboardSales: () => '/creator-dashboard/sales',
  creatorDashboardUpload: () => '/creator-dashboard/assets/upload',
  creatorDashboarAnalytics: () => '/creator-dashboard/analytics',
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
  assetReviews: (assetId: string) => `/api/assets/${assetId}/reviews`,
  assetsLicenses: (assetId: string) => `/api/assets/${assetId}/licenses`,
  assetAdminModeration: (assetId: string) => `/api/admin/assets/${assetId}`,
  assetAdminFeature: (assetId: string) =>
    `/api/admin/assets/${assetId}/feature`,
  creatorsApply: () => '/api/creators/apply',
  creatorsAnalyticsSales: () => '/api/creators/analytics/sales',
  creatorsAnalyticsVisits: () => '/api/creators/analytics/visits',
  creatorsAnalyticsAssets: () => '/api/creators/analytics/assets',
  notifications: () => '/api/notifications',
  notificationsReadAll: () => '/api/notifications/read-all',
  notificationRead: (id: string) => `/api/notifications/${id}/read`,
  purchases: () => '/api/purchases',
  checkout: () => '/api/checkout',
  dashboardDownloads: () => '/api/dashboard/downloads',
  dashboardReviews: () => '/api/dashboard/reviews',
  dashboardFavorites: () => '/api/dashboard/favorites',
  creatorDashboardSales: () => '/api/creator-dashboard/sales',
}

export const CACHE_KEYS = {
  testimonials: () => 'testimonials',
  categoriesWithCount: () => 'categories-with-count',
  assetFavorite: (assetId: string) => `asset-favorite-${assetId}`,
  assetById: (assetId: string) => `asset-${assetId}`,
  assetReviews: (assetId: string) => `reviews-asset-${assetId}`,
  viewedAssetsByProfile: (assetId: string, profileId: string) =>
    `viewed-asset-${assetId}-${profileId}`,
  assetLicenses: (assetId: string) => `asset-licenses-${assetId}`,
  exploreAssets: () => `explore-assets`,
  dashboardFavorites: (profileId: string) => `favorites-${profileId}`,
  dashboardReviews: (profileId: string) => `reviews-${profileId}`,
  dashboardDownloads: (profileId: string) => `downloads-${profileId}`,
  licenses: () => 'licenses',
  profile: (userId: string) => `profile-${userId}`,
  purchases: (profileId: string) => `purchases-${profileId}`,
  purchasedAsset: (profileId: string, assetId: string) =>
    `purchases-${profileId}-${assetId}`,
  creatorDashboardCreatorProfile: (profileId: string) =>
    `creator-dashboard-creator-profile-${profileId}`,
  creatorDashboardPurchases: (profileId: string) =>
    `creator-dashboard-purchases-${profileId}`,
  creatorDashboardAnalytics: (creatorProfileId: string) =>
    `creator-dashboard-analytics-${creatorProfileId}`,
}

export const WS_EVENTS = {
  NEW_NOTIFICATION: 'NEW_NOTIFICATION',
}

export const APP_DATA = {
  name: 'AIAssetHub',
  url: 'https://www.aiassethub.pro',
  lowercaseName: 'aiassethub',
}
export const EMAIL_FROM = `${APP_DATA.name} <${process.env.NEXT_PUBLIC_RESEND_EMAIL}>`
export const PAYPAL_EMAIL = process.env.NEXT_PUBLIC_PAYPAL_EMAIL
export const SUPPORT_EMAIL = `support@${APP_DATA.lowercaseName}.pro`
export const PRIVACY_EMAIL = `privacy@${APP_DATA.lowercaseName}.pro`
export const CREATORS_EMAIL = `creators@${APP_DATA.lowercaseName}.pro`
export const BIO_MAX_LENGTH = 500
export const SERVICE_CHARGE = 0.25
export const CART_COOKIE_NAME = 'cart_session_id'
export const CART_EXPIRY = 60 * 60 * 24 * 30 // 30 days in seconds
export const PAGE_PADDING = 'px-4 md:px-8'
export const TRANSITION_DELAY = 0.2
export const TWITTER_URL = 'https://x.com/AIAssetHub'
export const LINKEDIN_URL = 'https://www.linkedin.com/company/aiassethub'
export const INFINITE_SCROLL_NUMBER_OF_ITEMS = 10

export const HEADER_LINKS = [
  { name: 'Home', href: ROUTES.home() },
  { name: 'Explore', href: ROUTES.explore() },
  { name: 'For Creators', href: ROUTES.creators() },
]

export const FADE_IN_UP = (delay?: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay },
  },
})

export const STAGGER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}
