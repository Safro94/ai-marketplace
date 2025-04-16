'use client'

import { CartProvider } from '@/contexts/cart-context'
import NextTopLoader from 'nextjs-toploader'
import { FC, PropsWithChildren } from 'react'
import { ThemeProvider } from './theme-provider'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme='system' storageKey='ai-assets-theme'>
      <CartProvider>
        <NextTopLoader showSpinner={false} color='hsl(259 91% 58)' />
        {children}
      </CartProvider>
    </ThemeProvider>
  )
}
