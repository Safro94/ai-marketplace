import { AssetDownloadButton } from '@/components/asset-download-button'
import { formatDate } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import Image from 'next/image'
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
      className='flex items-center justify-between border-b pb-4 last:border-0'
    >
      <div className='flex items-center'>
        <div className='relative h-12 w-12 rounded overflow-hidden mr-4'>
          <Image
            src={
              purchaseItem.asset.featuredImage ||
              '/placeholder.svg?height=80&width=80'
            }
            alt={purchaseItem.asset.title}
            fill
            className='object-contain'
          />
        </div>

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
