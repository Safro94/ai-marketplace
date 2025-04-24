'use client'

import { AssetDownloadButton } from '@/components/asset-download-button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertCircle, Check } from 'lucide-react'
import { FC } from 'react'

interface Props {
  assetId: string
  assetUrl: string
  fileName: string
  purchaseItemId: string
}

export const AssetDownload: FC<Props> = ({
  assetId,
  assetUrl,
  fileName,
  purchaseItemId,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Download Asset</CardTitle>
        <CardDescription>
          {purchaseItemId
            ? 'You own this asset. Download it to start using it.'
            : 'Purchase this asset to download it.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {purchaseItemId ? (
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
        <AssetDownloadButton
          assetId={assetId}
          assetFileUrl={assetUrl}
          fileName={fileName}
          purchaseItemId={purchaseItemId}
        />
      </CardFooter>
    </Card>
  )
}
