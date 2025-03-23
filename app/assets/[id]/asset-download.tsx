'use client'

import { useSupabase } from '@/app/supabase-provider'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle, Check, Download } from 'lucide-react'
import { FC, useState } from 'react'

interface Props {
  assetId: number
  assetTitle: string
  isPurchased: boolean
}

export const AssetDownload: FC<Props> = ({
  assetId,
  assetTitle,
  isPurchased,
}) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const { toast } = useToast()
  const { user } = useSupabase()

  const handleDownload = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to download this asset',
        variant: 'destructive',
      })
      return
    }

    if (!isPurchased) {
      toast({
        title: 'Purchase required',
        description: 'You need to purchase this asset before downloading',
        variant: 'destructive',
      })
      return
    }

    setIsDownloading(true)

    // Simulate download process
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, this would be a call to download the asset file
      // const { data, error } = await supabase.storage
      //   .from('assets')
      //   .download(`assets/${assetId}/asset-file.zip`)

      // if (error) throw error

      // Create a download link
      const dummyData = new Blob(['Dummy asset content'], {
        type: 'application/octet-stream',
      })
      const url = URL.createObjectURL(dummyData)
      const a = document.createElement('a')
      a.href = url
      a.download = `${assetTitle.toLowerCase().replace(/\s+/g, '-')}.zip`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setDownloadComplete(true)
      toast({
        title: 'Download successful',
        description: 'Your asset has been downloaded successfully',
      })

      // Reset the download state after a delay
      setTimeout(() => {
        setDownloadComplete(false)
      }, 3000)
    } catch (error) {
      toast({
        title: 'Download failed',
        description:
          'There was a problem downloading your asset. Please try again.',
        variant: 'destructive',
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
