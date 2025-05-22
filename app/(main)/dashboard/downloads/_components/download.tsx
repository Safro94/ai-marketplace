import { AssetDownloadButton } from '@/components/asset-download-button'
import { AssetDownloadButtonFree } from '@/components/asset-download-button-free'
import { AssetPrimaryMedia } from '@/components/asset-primary-media'
import { formatDate } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { FC } from 'react'

type Props = Prisma.DownloadGetPayload<{
  select: {
    id: true
    Asset: {
      select: {
        id: true
        title: true
        assetFile: true
        featuredImage: true
        primaryMediaType: true
      }
    }
    purchaseItem: {
      select: {
        id: true
        createdAt: true
      }
    }
  }
}>

export const Download: FC<Props> = ({ id, Asset: asset, purchaseItem }) => {
  if (!asset) return null

  return (
    <div
      key={id}
      className='flex flex-col md:flex-row gap-4 items-center justify-between border-b pb-4 last:border-0'
    >
      <div className='flex flex-col md:flex-row items-center gap-2'>
        <AssetPrimaryMedia
          type={asset.primaryMediaType}
          alt={asset.title}
          src={asset.featuredImage || '/placeholder.svg?height=80&width=80'}
        />

        <div>
          <h4 className='font-medium'>{asset.title}</h4>

          {purchaseItem && (
            <p className='text-xs text-muted-foreground'>
              Purchased on {formatDate(purchaseItem.createdAt)}
            </p>
          )}
        </div>
      </div>

      <div>
        {purchaseItem ? (
          <AssetDownloadButton
            assetId={asset.id}
            purchaseItemId={purchaseItem.id}
            assetFileUrl={asset.assetFile}
            fileName={asset.title}
          />
        ) : (
          <AssetDownloadButtonFree
            assetId={asset.id}
            assetFileUrl={asset.assetFile}
            fileName={asset.title}
          />
        )}
      </div>
    </div>
  )
}
