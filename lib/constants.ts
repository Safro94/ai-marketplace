export const ROUTES = {
  home: () => '/',
  privacyPolicy: () => '/privacy-policy',
  terms: () => '/terms-of-service',
  login: () => '/login',
  signUp: () => '/signup',
  resetPassword: () => '/reset-password',
  explore: () => '/explore',
  categories: () => '/categories',
  creators: () => '/creators',
  creatorDashboard: () => '/creator-dashboard',
}

export const API_ROUTES = {}
export const EMAIL_FROM = `AI Assets <${process.env.NEXT_PUBLIC_RESEND_EMAIL}>`
export const PAYPAL_EMAIL = process.env.NEXT_PUBLIC_PAYPAL_EMAIL
