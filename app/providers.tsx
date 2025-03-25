'use client'

import { FC, PropsWithChildren } from 'react'
import { SessionProvider } from './session-provider'
import { ThemeProvider } from './theme-provider'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem={false}
      disableTransitionOnChange
    >
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  )
}
