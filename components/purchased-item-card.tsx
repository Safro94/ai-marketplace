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
    <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
      <div className='relative w-full md:w-48 h-32 self-center flex-shrink-0'>
        <Image
          src={asset.featuredImage || '/placeholder.svg'}
          alt={asset.title}
          fill
          className='object-contain'
        />
      </div>

      <div className='flex-1'>
        <div className='flex flex-col lg:flex-row justify-between gap-2'>
          <div>
            <div className='flex flex-col md:flex-row gap-2 items-center'>
              <h3 className='text-xl font-medium'>{asset.title}</h3>

              <Badge>{asset.category.name}</Badge>
            </div>

            <p className='text-muted-foreground line-clamp-2 mb-2'>
              {asset.description}
            </p>

            <div className='flex flex-col flex-wrap gap-2 md:flex-row md:items-center text-sm text-muted-foreground'>
              <span>{format(new Date(createdAt), 'PPP')}</span>
              <span className='hidden md:block'>•</span>
              <span>{formatCurrency(amount)}</span>
              <span className='hidden md:block'>•</span>
              <span>{assetLicense?.license.name}</span>
              <span className='hidden md:block'>•</span>
              <span>Lincese Key: {licenseKey}</span>
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
