import { AssetDownloadButton } from '@/components/asset-download-button'
import { NotFound } from '@/components/not-found'
import { Card, CardContent } from '@/components/ui/card'
import { getDashboardDownloads } from '@/data-access/download'
import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { formatDate } from '@/lib/utils'
import { Download } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default async function Downloads() {
  const { user } = await validateSession(ROUTES.dashboard())
  const profile = await getUserProfile(user.id)

  if (!profile) {
    redirect(`${ROUTES.login()}?callbackUrl=${ROUTES.dashboard()}`)
  }

  const downloadHistory = await getDashboardDownloads(profile.id)

  return (
    <>
      <Card>
        {!!downloadHistory.length ? (
          <CardContent className='py-6'>
            <div className='space-y-4'>
              {downloadHistory.map((download) => (
                <div
                  key={download.id}
                  className='flex items-center justify-between border-b pb-4 last:border-0'
                >
                  <div className='flex items-center'>
                    <div className='relative h-12 w-12 rounded overflow-hidden mr-4'>
                      <Image
                        src={
                          download.purchaseItem.asset.featuredImage ||
                          '/placeholder.svg?height=80&width=80'
                        }
                        alt={download.purchaseItem.asset.title}
                        fill
                        className='object-cover'
                      />
                    </div>

                    <div>
                      <h4 className='font-medium'>
                        {download.purchaseItem.asset.title}
                      </h4>

                      <p className='text-xs text-muted-foreground'>
                        Downloaded on{' '}
                        {formatDate(download.purchaseItem.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <AssetDownloadButton
                      assetId={download.purchaseItem.asset.id}
                      purchaseItemId={download.purchaseItem.id}
                      assetFileUrl={download.purchaseItem.asset.assetFile}
                      fileName={download.purchaseItem.asset.title}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        ) : (
          <NotFound
            title='No downloads yet'
            description="You haven't downloaded any assets yet. Visit your purchased assets to download them."
            icon={Download}
          />
        )}
      </Card>
    </>
  )
}
