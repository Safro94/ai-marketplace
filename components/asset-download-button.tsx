'use client'

import { saveDownload } from '@/actions/asset-download'
import { LoadingButton } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { downloadAsset, tryCatch } from '@/lib/utils'
import { Download } from 'lucide-react'
import { FC, useState } from 'react'

interface Props {
  assetId: string
  assetFileUrl: string
  fileName: string
  purchaseItemId: string
}

export const AssetDownloadButton: FC<Props> = ({
  assetFileUrl,
  fileName,
  assetId,
  purchaseItemId,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    if (!assetFileUrl) {
      toast.error('Error', {
        description: 'Please enter a URL',
      })
      return
    }

    setIsLoading(true)

    const { error: downloadError } = await tryCatch(
      downloadAsset(assetFileUrl, fileName),
    )

    setIsLoading(false)

    if (downloadError) {
      toast.error('Error', {
        description: 'Failed to download file',
      })
      return
    }

    const { error: saveError } = await tryCatch(
      saveDownload(assetId, purchaseItemId),
    )

    if (saveError) {
      toast.error('Error', {
        description: 'Failed to save file download',
      })
      return
    }
  }

  return (
    <div>
      <LoadingButton
        className='flex-1'
        isLoading={isLoading}
        disabled={isLoading}
        onClick={handleDownload}
      >
        <Download className='mr-2 h-4 w-4' />
        Download
      </LoadingButton>
    </div>
  )
}
