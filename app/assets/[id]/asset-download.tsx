'use client'

import { Button } from '@/components/ui/button'
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
import { AlertCircle, Check, Download } from 'lucide-react'
import { FC, useEffect, useState } from 'react'

interface Props {
  assetId: string
  assetTitle: string
}

export const AssetDownload: FC<Props> = ({ assetId, assetTitle }) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [isPurchased, setIsPurchased] = useState<boolean | null>(null)
  const { user } = useAuth()

  // Check if user has purchased this asset
  useEffect(() => {
    const checkPurchase = async () => {
      if (!user) {
        setIsPurchased(false)
        return
      }

      try {
        const response = await fetch(`/api/assets/${assetId}/check-purchase`)

        if (response.ok) {
          const { purchased } = await response.json()
          setIsPurchased(purchased)
        } else {
          setIsPurchased(false)
        }
      } catch (error) {
        console.error('Error checking purchase:', error)
        setIsPurchased(false)
      }
    }

    checkPurchase()
  }, [user, assetId])

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
      const response = await fetch(`/api/assets/${assetId}/download`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Download failed')
      }

      const { downloadUrl, assetName } = await response.json()

      // Create a download link
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `${assetName.toLowerCase().replace(/\s+/g, '-')}.zip`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)

      setDownloadComplete(true)

      toast.success('Download successful', {
        description: 'Your asset has been downloaded successfully',
      })

      // Reset the download state after a delay
      setTimeout(() => {
        setDownloadComplete(false)
      }, 3000)
    } catch (error) {
      toast.error('Download failed', {
        description:
          error instanceof Error
            ? error.message
            : 'There was a problem downloading your asset. Please try again.',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  if (isPurchased === null) {
    return (
      <Card>
        <CardContent className='p-6 flex items-center justify-center'>
          <div className='animate-pulse'>Loading...</div>
        </CardContent>
      </Card>
    )
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
        <Button
          className='w-full'
          onClick={handleDownload}
          disabled={isDownloading || !isPurchased}
        >
          {isDownloading ? (
            <span className='flex items-center'>
              <svg
                className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Downloading...
            </span>
          ) : downloadComplete ? (
            <span className='flex items-center'>
              <Check className='mr-2 h-4 w-4' />
              Downloaded
            </span>
          ) : (
            <span className='flex items-center'>
              <Download className='mr-2 h-4 w-4' />
              Download Asset
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
