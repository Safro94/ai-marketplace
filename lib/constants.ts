export const ROUTES = {
  home: () => '/',
  privacyPolicy: () => '/privacy-policy',
  terms: () => '/terms-of-service',
  login: () => '/login',
  signUp: () => '/signup',
  resetPassword: () => '/reset-password',
  dashboard: () => '/dashboard',
  account: () => '/account',
  purchases: () => '/purchases',
  explore: () => '/explore',
  categories: () => '/categories',
  creators: () => '/creators',
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
}
export const EMAIL_FROM = `AI Assets <${process.env.NEXT_PUBLIC_RESEND_EMAIL}>`
export const PAYPAL_EMAIL = process.env.NEXT_PUBLIC_PAYPAL_EMAIL

export const HEADER_LINKS = [
  { name: 'Home', href: ROUTES.home() },
  { name: 'Explore', href: ROUTES.explore() },
  { name: 'Categories', href: ROUTES.categories() },
  { name: 'For Creators', href: ROUTES.creators() },
]
