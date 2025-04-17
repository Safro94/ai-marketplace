import { APP_DATA, ROUTES } from '@/lib/constants'
import { siteConfig } from '@/lib/seo-config'
import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({
    name: siteConfig.name,
    short_name: APP_DATA.name,
    description: siteConfig.description,
    start_url: ROUTES.home(),
    display: 'standalone',
    background_color: '#121212',
    theme_color: 'hsl(259 91% 58%)',
    // icons: [
    //   {
    //     src: '/android-chrome-192x192.png',
    //     sizes: '192x192',
    //     type: 'image/png',
    //   },
    //   {
    //     src: '/android-chrome-512x512.png',
    //     sizes: '512x512',
    //     type: 'image/png',
    //   },
    // ],
  })
}
