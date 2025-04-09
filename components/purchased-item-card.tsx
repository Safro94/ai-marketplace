'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import { Prisma } from '@prisma/client'
import { format } from 'date-fns'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { FC } from 'react'
import { AssetDownloadButton } from './asset-download-button'
import { Badge } from './ui/badge'

interface Props {
  purchasedItem: Prisma.PurchaseItemGetPayload<{
    include: {
      assetLicense: {
        include: {
          license: true
        }
      }
      asset: {
        include: {
          category: true
        }
      }
    }
  }>
}

export const PurchasedItemCard: FC<Props> = ({ purchasedItem }) => (
  <Card className='p-6'>
    <div className='flex flex-col md:flex-row md:items-center gap-4'>
      <div className='relative w-full md:w-48 h-32 self-center'>
        <Image
          src={purchasedItem.asset.featuredImage || '/placeholder.svg'}
          alt={purchasedItem.asset.title}
          fill
          className='object-cover'
        />
      </div>

      <div className='flex-1'>
        <div className='flex flex-col md:flex-row justify-between'>
          <div>
            <h3 className='text-xl font-medium mb-2'>
              {purchasedItem.asset.title}
            </h3>

            <p className='text-muted-foreground line-clamp-2 mb-4'>
              {purchasedItem.asset.description}
            </p>

            <div className='flex flex-col gap-4 md:gap-0 md:flex-row md:items-center text-sm text-muted-foreground'>
              <span>
                Purchased {format(new Date(purchasedItem.createdAt), 'PPP')}
              </span>

              <span className='hidden md:block mx-2'>•</span>
              <span>${purchasedItem.amount.toFixed(2)}</span>
              <span className='hidden md:block mx-2'>•</span>
              <span>{purchasedItem.assetLicense?.license.name}</span>
              <span className='hidden md:block mx-2'>•</span>
              <span>Lincese Key: {purchasedItem.licenseKey}</span>
              <span className='hidden md:block mx-2'>•</span>
              <Badge variant='secondary'>
                {purchasedItem.asset.category.name}
              </Badge>
            </div>
          </div>

          <div className='mt-4 md:mt-0 flex md:flex-col gap-2 md:justify-center'>
            <AssetDownloadButton
              assetId={purchasedItem.asset.id}
              purchaseItemId={purchasedItem.id}
              assetFileUrl={purchasedItem.asset.assetFile}
              fileName={purchasedItem.asset.title}
            />

            <Button size='sm' variant='outline' asChild>
              <a
                href={ROUTES.assetsDetail(purchasedItem.asset.id)}
                target='_blank'
              >
                <ExternalLink className='mr-2 h-4 w-4' />
                View Details
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Card>
)
