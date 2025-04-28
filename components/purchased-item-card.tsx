'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { format } from 'date-fns'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { FC } from 'react'
import { AssetDownloadButton } from './asset-download-button'
import { Badge } from './ui/badge'

type Props = Prisma.PurchaseItemGetPayload<{
  select: {
    id: true
    amount: true
    createdAt: true
    licenseKey: true

    assetLicense: {
      select: {
        license: {
          select: {
            name: true
          }
        }
      }
    }
    asset: {
      select: {
        id: true
        title: true
        description: true
        featuredImage: true
        assetFile: true

        category: {
          select: {
            name: true
          }
        }
      }
    }
  }
}>

export const PurchasedItemCard: FC<Props> = ({
  asset,
  assetLicense,
  id,
  amount,
  createdAt,
  licenseKey,
}) => (
  <Card className='p-6'>
    <div className='flex flex-col md:flex-row md:items-center gap-4'>
      <div className='relative w-full md:w-48 h-32 self-center'>
        <Image
          src={asset.featuredImage || '/placeholder.svg'}
          alt={asset.title}
          fill
          className='object-contain'
        />
      </div>

      <div className='flex-1'>
        <div className='flex flex-col md:flex-row justify-between gap-4'>
          <div>
            <h3 className='text-xl font-medium mb-2'>{asset.title}</h3>

            <p className='text-muted-foreground line-clamp-2 mb-4'>
              {asset.description}
            </p>

            <div className='flex flex-col gap-4 md:gap-0 md:flex-row md:items-center text-sm text-muted-foreground'>
              <span>Purchased {format(new Date(createdAt), 'PPP')}</span>

              <span className='hidden md:block mx-2'>•</span>
              <span>{formatCurrency(amount)}</span>
              <span className='hidden md:block mx-2'>•</span>
              <span>{assetLicense?.license.name}</span>
              <span className='hidden md:block mx-2'>•</span>
              <span>Lincese Key: {licenseKey}</span>
              <span className='hidden md:block mx-2'>•</span>

              <Badge variant='secondary'>{asset.category.name}</Badge>
            </div>
          </div>

          <div className='mt-4 md:mt-0 flex md:flex-col gap-2 md:justify-center'>
            <AssetDownloadButton
              assetId={asset.id}
              purchaseItemId={id}
              assetFileUrl={asset.assetFile}
              fileName={asset.title}
            />

            <Button variant='outline' asChild>
              <a href={ROUTES.assetsDetail(asset.id)} target='_blank'>
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
