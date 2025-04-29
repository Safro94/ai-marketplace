import { ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { format } from 'date-fns'
import Image from 'next/image'
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
}) => {
  return (
    <Link
      key={id}
      href={ROUTES.assetsDetail(assetId)}
      className='font-medium'
      target='_blank'
    >
      <div className='flex flex-col md:flex-row md:items-center gap-4'>
        <div className='relative w-full md:w-32 h-24 self-center'>
          <Image
            src={asset.featuredImage || '/placeholder.svg'}
            alt={asset.title}
            fill
            className='object-contain'
          />
        </div>

        <div className='flex-1 flex flex-col md:flex-row justify-between items-center gap-4'>
          <div>
            <h3 className='text-md font-medium'>{asset.title}</h3>

            <p className='text-muted-foreground text-sm'>
              {assetLicense?.license.name} •{' '}
              {format(new Date(createdAt), 'MMM d')}
            </p>
          </div>

          <span className='font-bold'>{formatCurrency(amount)}</span>
        </div>
      </div>
    </Link>
  )
}
