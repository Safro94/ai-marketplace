'use client'

import { LoadingButton } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import { useAuth } from '@/hooks/use-auth'
import { downloadAsset } from '@/lib/utils'
import { AlertCircle, Check, Download } from 'lucide-react'
import { FC, useState } from 'react'

interface Props {
  assetId: string
  assetUrl: string
  fileName: string
  isPurchased: boolean
}

export const AssetDownload: FC<Props> = ({
  assetId,
  assetUrl,
  fileName,
  isPurchased,
}) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const { user } = useAuth()

  const handleDownload = async () => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to download this asset',
      })
      return
    }

    if (!isPurchased) {
      toast.error('Purchase required', {
        description: 'You need to purchase this asset before downloading',
      })
      return
    }

    setIsDownloading(true)

    try {
      await downloadAsset({ url: assetUrl, fileName, assetId })

      toast.success('Download successful', {
        description: 'Your asset has been downloaded successfully',
      })
    } catch (err) {
      toast.error('Download failed', {
        description:
          'There was a problem downloading your asset. Please try again.',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Download Asset</CardTitle>
        <CardDescription>
          {isPurchased
            ? 'You own this asset. Download it to start using it.'
            : 'Purchase this asset to download it.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isPurchased ? (
          <div className='text-sm space-y-2'>
            <p className='flex items-center'>
              <Check className='h-4 w-4 text-green-500 mr-2' />
              Unlimited downloads
            </p>

            <p className='flex items-center'>
              <Check className='h-4 w-4 text-green-500 mr-2' />
              Access to future updates
            </p>

            <p className='flex items-center'>
              <Check className='h-4 w-4 text-green-500 mr-2' />
              Usage according to license terms
            </p>
          </div>
        ) : (
          <div className='text-sm space-y-2'>
            <p className='flex items-center'>
              <AlertCircle className='h-4 w-4 text-amber-500 mr-2' />
              You need to purchase this asset first
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <LoadingButton
          className='w-full'
          onClick={handleDownload}
          isLoading={isDownloading}
          disabled={isDownloading || !isPurchased}
        >
          <Download className='mr-2 h-4 w-4' />
          Download Asset
        </LoadingButton>
      </CardFooter>
    </Card>
  )
}
