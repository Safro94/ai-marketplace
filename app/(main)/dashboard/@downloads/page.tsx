import { NotFound } from '@/components/not-found'
import { Card, CardContent } from '@/components/ui/card'
import { getDashboardDownloads } from '@/data-access/download'
import { getUserProfile } from '@/data-access/profile'
import { INFINITE_SCROLL_NUMBER_OF_ITEMS, ROUTES } from '@/lib/constants'
import { validateSession } from '@/lib/session'
import { Download } from 'lucide-react'
import { redirect } from 'next/navigation'
import { DownloadsList } from './_components/downloads-list'

export default async function Downloads() {
  const { user } = await validateSession(ROUTES.dashboard())
  const profile = await getUserProfile(user.id)

  if (!profile) {
    redirect(`${ROUTES.login()}?callbackUrl=${ROUTES.dashboard()}`)
  }

  const downloadHistory = await getDashboardDownloads({
    profileId: profile.id,
    offset: 0,
    limit: INFINITE_SCROLL_NUMBER_OF_ITEMS,
  })

  return (
    <>
      <Card>
        {!!downloadHistory.length ? (
          <CardContent className='py-6'>
            <div className='space-y-4'>
              <DownloadsList downloads={downloadHistory} />
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
