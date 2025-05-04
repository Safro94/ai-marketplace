import { NotFound } from '@/components/not-found'
import { DashboardPageContainer } from '@/components/page-container'
import { Card, CardContent } from '@/components/ui/card'
import { getDashboardDownloads } from '@/data-access/download'
import { INFINITE_SCROLL_NUMBER_OF_ITEMS } from '@/lib/constants'
import { Download } from 'lucide-react'
import { getCachedProfileData } from '../utils'
import { DownloadsList } from './_components/downloads-list'

export default async function Downloads() {
  const { profile } = await getCachedProfileData()

  const downloadHistory = await getDashboardDownloads({
    profileId: profile.id,
    offset: 0,
    limit: INFINITE_SCROLL_NUMBER_OF_ITEMS,
  })

  return (
    <DashboardPageContainer title='Downloads'>
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
    </DashboardPageContainer>
  )
}
