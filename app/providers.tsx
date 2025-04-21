'use client'

import { CartProvider } from '@/contexts/cart-context'
import { ReCaptchaProvider } from 'next-recaptcha-v3'
import NextTopLoader from 'nextjs-toploader'
import { FC, PropsWithChildren } from 'react'
import { ThemeProvider } from './theme-provider'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        <NextTopLoader showSpinner={false} color='hsl(264.7 66.7% 20%)' />

        <ReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        >
          {children}
        </ReCaptchaProvider>
      </CartProvider>
    </ThemeProvider>
  )
}
