import { AssetDownloadButton } from '@/components/asset-download-button'
import { AssetPrimaryMedia } from '@/components/asset-primary-media'
import { formatDate } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { FC } from 'react'

type Props = Prisma.DownloadGetPayload<{
  select: {
    id: true
    purchaseItem: {
      select: {
        id: true
        createdAt: true
        asset: {
          select: {
            id: true
            title: true
            assetFile: true
            featuredImage: true
            primaryMediaType: true
          }
        }
      }
    }
  }
}>

export const Download: FC<Props> = ({ id, purchaseItem }) => {
  return (
    <div
      key={id}
      className='flex flex-col md:flex-row gap-4 items-center justify-between border-b pb-4 last:border-0'
    >
      <div className='flex flex-col md:flex-row items-center '>
        <AssetPrimaryMedia
          type={purchaseItem.asset.primaryMediaType}
          alt={purchaseItem.asset.title}
          src={
            purchaseItem.asset.featuredImage ||
            '/placeholder.svg?height=80&width=80'
          }
        />

        <div>
          <h4 className='font-medium'>{purchaseItem.asset.title}</h4>

          <p className='text-xs text-muted-foreground'>
            Downloaded on {formatDate(purchaseItem.createdAt)}
          </p>
        </div>
      </div>

      <div>
        <AssetDownloadButton
          assetId={purchaseItem.asset.id}
          purchaseItemId={purchaseItem.id}
          assetFileUrl={purchaseItem.asset.assetFile}
          fileName={purchaseItem.asset.title}
        />
      </div>
    </div>
  )
}
