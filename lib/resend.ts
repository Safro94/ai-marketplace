import { Resend } from 'resend'

declare global {
  // eslint-disable-next-line no-var
  var resend: Resend | undefined
}

// Use a global variable to prevent multiple Resend instances in development
export const resend = global.resend || new Resend(process.env.RESEND_API_KEY)

if (process.env.NODE_ENV !== 'production') {
  global.resend = resend
}
