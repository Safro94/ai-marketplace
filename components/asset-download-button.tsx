'use client'

import { saveDownload } from '@/actions/asset-download'
import { LoadingButton } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { downloadAsset } from '@/lib/utils'
import { Download } from 'lucide-react'
import { FC, useTransition } from 'react'

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
  const [isPending, startTransition] = useTransition()

  const handleDownload = async () => {
    if (!assetFileUrl) {
      toast.error('Error', {
        description: 'Please enter a URL',
      })
      return
    }

    startTransition(async () => {
      const result = await downloadAsset({
        url: assetFileUrl,
        fileName,
        assetId,
      })

      if (!result.success) {
        toast.error('Download Failed', {
          description: result.error || 'Failed to download file',
        })
        return
      }

      // Success handling here
      toast.success('Download Successful', {
        description: 'Your file has been downloaded successfully',
      })

      startTransition(async () => {
        const saveResult = await saveDownload(assetId, purchaseItemId)

        if (!saveResult.success) {
          toast.error('Save Failed', {
            description: saveResult.error || 'Failed to save download',
          })

          return
        }
      })
    })
  }

  return (
    <div className='w-full'>
      <LoadingButton
        className='flex-1 w-full'
        isLoading={isPending}
        disabled={isPending}
        onClick={handleDownload}
      >
        <Download className='mr-2 h-4 w-4' />
        Download
      </LoadingButton>
    </div>
  )
}
