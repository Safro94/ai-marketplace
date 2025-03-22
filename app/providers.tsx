'use client'

import { FC, PropsWithChildren } from 'react'
import { SupabaseProvider } from './supabase-provider'
import { ThemeProvider } from './theme-provider'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem={false}
      disableTransitionOnChange
    >
      <SupabaseProvider>{children}</SupabaseProvider>
    </ThemeProvider>
  )
}
