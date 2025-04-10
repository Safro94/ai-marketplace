import { PurchasedItemCard } from '@/components/purchased-item-card'
import { Badge } from '@/components/ui/badge'
import { Prisma, PurchaseStatus } from '@prisma/client'
import { format } from 'date-fns'
import { FC } from 'react'

type Props = Prisma.PurchaseGetPayload<{
  include: {
    purchaseItems: {
      include: {
        asset: {
          include: {
            category: true
            creator: {
              include: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
        assetLicense: {
          include: {
            license: true
          }
        }
      }
    }
  }
}>

export const Purchase: FC<Props> = ({
  amount,
  createdAt,
  id,
  status,
  purchaseItems,
}) => {
  return (
    <div className='bg-white border-primary border p-4 rounded-md'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex flex-col gap-1'>
          <h2 className='text-lg font-bold'>#{id}</h2>
          <h3 className='text-sm font-semibold text-muted-foreground'>
            {format(new Date(createdAt), 'MMM d, yyyy')}
          </h3>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className='space-y-2'>
        {purchaseItems.map((purchasedItem) => (
          <PurchasedItemCard
            key={purchasedItem.id}
            purchasedItem={purchasedItem}
          />
        ))}
      </div>
    </div>
  )
}

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case PurchaseStatus.COMPLETED:
      return (
        <Badge className='text-sm bg-green-100 text-green-800 hover:bg-green-100'>
          Completed
        </Badge>
      )
    case PurchaseStatus.PENDING:
      return (
        <Badge className='text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-100'>
          Pending
        </Badge>
      )
    case PurchaseStatus.FAILED:
      return (
        <Badge className='text-sm bg-red-100 text-red-800 hover:bg-red-100'>
          Failed
        </Badge>
      )
    default:
      return <Badge variant='outline'>{status}</Badge>
  }
}
