import { AssetDownloadButtonFree } from '@/components/asset-download-button-free'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Check } from 'lucide-react'
import { FC } from 'react'

interface Props {
  assetId: string
  assetUrl: string
  fileName: string
}

export const AssetDownloadFree: FC<Props> = ({
  assetId,
  assetUrl,
  fileName,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Download Asset</CardTitle>
        <CardDescription>Download the asset to start using it</CardDescription>
      </CardHeader>

      <CardContent>
        <p className='text-sm flex items-center'>
          <Check className='h-4 w-4 text-green-500 mr-2' />
          Unlimited downloads
        </p>
      </CardContent>

      <CardFooter>
        <AssetDownloadButtonFree
          assetId={assetId}
          assetFileUrl={assetUrl}
          fileName={fileName}
        />
      </CardFooter>
    </Card>
  )
}
