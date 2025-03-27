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
}

export const EMAIL_FROM = `AI Assets <${process.env.NEXT_PUBLIC_RESEND_EMAIL}>`
export const PAYPAL_EMAIL = process.env.NEXT_PUBLIC_PAYPAL_EMAIL

export const HEADER_LINKS = [
  { name: 'Home', href: ROUTES.home() },
  { name: 'Explore', href: ROUTES.explore() },
  { name: 'Categories', href: ROUTES.categories() },
  { name: 'For Creators', href: ROUTES.creators() },
]
