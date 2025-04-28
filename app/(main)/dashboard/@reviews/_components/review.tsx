import { formatDate } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { StarIcon } from 'lucide-react'
import { FC } from 'react'

type Props = Prisma.ReviewGetPayload<{
  select: {
    id: true
    title: true
    comment: true
    createdAt: true

    asset: {
      select: {
        title: true
      }
    }
  }
}>

export const Review: FC<Props> = ({ id, asset, createdAt, title, comment }) => {
  return (
    <div key={id} className='border-b pb-6 last:border-0'>
      <div className='flex items-start justify-between mb-2'>
        <div>
          <h4 className='font-medium'>{asset.title}</h4>
          <div className='flex mt-1'>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className='h-4 w-4 fill-yellow-400 text-yellow-400'
              />
            ))}
          </div>
        </div>

        <div className='text-xs text-muted-foreground'>
          {formatDate(createdAt)}
        </div>
      </div>

      <h5 className='font-medium mb-1'>{title}</h5>

      <p className='text-sm text-muted-foreground'>{comment}</p>
    </div>
  )
}
