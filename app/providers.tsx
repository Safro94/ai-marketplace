'use client'

import { CartProvider } from '@/contexts/cart-context'
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
        {children}
      </CartProvider>
    </ThemeProvider>
  )
}
