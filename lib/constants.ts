export const ROUTES = {
  home: () => '/',
  privacyPolicy: () => '/privacy',
  terms: () => '/terms',
  login: () => '/login',
  signUp: () => '/signup',
  about: () => '/about',
  contact: () => '/contact',
  resetPassword: () => '/reset-password',
  dashboard: () => '/dashboard',
  assets: () => '/assets',
  account: () => '/account',
  purchases: () => '/purchases',
  explore: () => '/explore',
  featured: () => '/featured',
  newReleases: () => '/new-releases',
  categories: () => '/categories',
  creators: () => '/creators',
  creatorsThankYou: () => '/creators/thank-you',
  creatorsApply: () => '/creators/apply',
  creatorTerms: () => '/creator-terms',
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
  search: () => `/api/search`,
  categories: () => `/api/categories`,
  cases: () => `/api/use-cases`,
  licenses: () => '/api/licenses',
  assets: () => '/api/assets',
  assetsLicenses: (assetId: string) => `/api/assets/${assetId}/licenses`,
  assetsReview: (assetId: string) => `/api/assets/${assetId}/reviews`,
  assetAdminModeration: (assetId: string) => `/api/admin/moderation/${assetId}`,
  creatorsApply: () => '/api/creators/apply',
}

export const EMAIL_FROM = `AI Assets <${process.env.NEXT_PUBLIC_RESEND_EMAIL}>`
export const PAYPAL_EMAIL = process.env.NEXT_PUBLIC_PAYPAL_EMAIL

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
  MAX_PRICE = 'maxPrice',
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
