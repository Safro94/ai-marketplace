'use client'

import { FC, PropsWithChildren } from 'react'
import { ThemeProvider } from './theme-provider'

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme='system' storageKey='ai-assets-theme'>
      {children}
    </ThemeProvider>
  )
}
