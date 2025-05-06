import { AssetImage } from '@/components/asset-image'
import { ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { format } from 'date-fns'
import Link from 'next/link'
import { FC } from 'react'

type Props = Prisma.PurchaseItemGetPayload<{
  include: {
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
        featuredImage: true
      }
    }
  }
}>

export const CreatorDashboardSale: FC<Props> = ({
  id,
  assetId,
  asset,
  assetLicense,
  amount,
  createdAt,
  commisionRate,
}) => {
  return (
    <Link
      key={id}
      href={ROUTES.assetsDetail(assetId)}
      className='font-medium'
      target='_blank'
    >
      <div className='flex flex-col md:flex-row md:items-center gap-4'>
        <AssetImage
          src={asset.featuredImage || '/placeholder.svg'}
          alt={asset.title}
        />

        <div className='flex-1 flex flex-col md:flex-row justify-between items-center gap-4'>
          <div>
            <h3 className='text-md font-semibold'>{asset.title}</h3>

            <div className='flex flex-col text-center md:text-left gap-2 md:flex-row text-muted-foreground text-sm'>
              <span>{assetLicense?.license.name}</span>
              <span className='hidden md:block'>•</span>
              <span>{format(new Date(createdAt), 'MMM d')}</span>
              <span className='hidden md:block'>•</span>
              <span>Commission: {commisionRate}%</span>
            </div>
          </div>

          <span className='font-bold'>{formatCurrency(amount)}</span>
        </div>
      </div>
    </Link>
  )
}
