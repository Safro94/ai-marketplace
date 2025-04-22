import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/toast'
import { generateOrganizationJsonLd, siteConfig } from '@/lib/seo-config'
import { cn } from '@/lib/utils'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import type React from 'react'
import { extractRouterConfig } from 'uploadthing/server'
import { fileRouter } from './api/uploadthing/core'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: 'hsl(264.7 66.7% 20%)',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <Script
          id='organization-schema'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationJsonLd()),
          }}
        />
      </head>
      <body
        className={cn('bg-background font-sans antialiased', inter.className)}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <SpeedInsights />

        <Providers>
          <div className='min-h-screen grid grid-rows-[max-content_1fr_max-content]'>
            <Header />
            <main className='bg-main-background overflow-auto'>{children}</main>
            <Footer />
          </div>

          <Toaster richColors />
        </Providers>
      </body>
    </html>
  )
}
