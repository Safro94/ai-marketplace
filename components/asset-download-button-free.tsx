'use client'

import { saveDownload } from '@/actions/asset-download'
import { LoadingButton } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { createDownloadLink } from '@/lib/utils'
import { Download } from 'lucide-react'
import { FC, useTransition } from 'react'

interface Props {
  assetId: string
  assetFileUrl: string
  fileName: string
}

export const AssetDownloadButtonFree: FC<Props> = ({
  assetFileUrl,
  fileName,
  assetId,
}) => {
  const [isPending, startTransition] = useTransition()

  const handleDownload = async () => {
    if (!assetFileUrl) {
      toast.error('Error', {
        description: 'Cannot find asset URL',
      })

      return
    }

    startTransition(async () => {
      try {
        const response = await fetch(assetFileUrl)

        if (!response.ok) {
          toast.error('Error', {
            description: 'Failed to download your file',
          })
          return
        }

        const file = await response.blob()
        createDownloadLink(file, fileName)

        toast.success('Download Successful', {
          description: 'Your file has been downloaded successfully',
        })

        startTransition(async () => {
          const { error } = await saveDownload(assetId)

          if (error) {
            toast.error('Save Failed', {
              description: error || 'Failed to save download',
            })

            return
          }
        })
      } catch (e) {
        console.error(e)
        toast.error('Error', {
          description: 'Failed to download your file',
        })
      }
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
