'use client'

import { InfiniteScrollList } from '@/components/ui/infinite-scroll-list'
import { API_ROUTES } from '@/lib/constants'
import { ComponentProps, FC } from 'react'
import { Download } from './download'

type DownloadProps = ComponentProps<typeof Download>

interface Props {
  downloads: DownloadProps[]
}

export const DownloadsList: FC<Props> = ({ downloads }) => {
  return (
    <InfiniteScrollList<DownloadProps>
      initialData={downloads}
      endpointUrl={API_ROUTES.dashboardDownloads()}
      ItemComponent={(item) => <Download {...item} />}
    />
  )
}
