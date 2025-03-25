export const ROUTES = {
  home: () => '/',
  newOrder: () => '/order/new',
  orderCreated: (orderSlug: string) => `/order/${orderSlug}/created`,
  orderPreview: (orderSlug: string) => `/order/${orderSlug}/preview`,
  orderSuccess: (orderSlug: string, email?: string) =>
    `/order/${orderSlug}/success${email ? `?clientEmail=${email}` : ''}`,
  integrations: () => '/integrations',
  privacyPolicy: () => '/privacy-policy',
  terms: () => '/terms-of-service',
  signIn: () => '/sign-in',
  signUp: () => '/sign-up',
  myProfile: () => '/my-profile',
  myOrders: () => '/my-orders',
  resetPassword: () => '/reset-password',
}

export const API_ROUTES = {}
export const EMAIL_FROM = `AI Assets <${process.env.NEXT_PUBLIC_RESEND_EMAIL}>`
export const PAYPAL_EMAIL = process.env.NEXT_PUBLIC_PAYPAL_EMAIL
