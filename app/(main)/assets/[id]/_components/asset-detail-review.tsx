import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import { StarIcon } from 'lucide-react'
import { FC } from 'react'

type Props = Prisma.ReviewGetPayload<{
  include: {
    userProfile: {
      include: {
        user: {
          select: {
            name: true
            image: true
          }
        }
      }
    }
  }
}>

export const AssetDetailReview: FC<Props> = ({
  id,
  userProfile,
  createdAt,
  isVerified,
  rating,
  title,
  comment,
}) => {
  if (!title) return null

  return (
    <div key={id} className='border-b border-border/50 pb-6 last:border-0'>
      <div className='flex items-start justify-between mb-2'>
        <div className='flex items-center space-x-3'>
          <Avatar
            className='h-8 w-8'
            src={
              userProfile.user.image || '/placeholder.svg?height=40&width=40'
            }
            alt={userProfile.user.name || 'User'}
            fallback={(userProfile.user.name || 'U').charAt(0)}
          />

          <div>
            <div className='font-medium'>
              {userProfile.user.name || 'Anonymous User'}
            </div>

            <div className='text-xs text-muted-foreground'>
              {formatDate(createdAt)}
            </div>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <div className='flex'>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-4 w-4 ${
                  star <= rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          {isVerified && (
            <Badge
              variant='outline'
              className='text-xs bg-green-50 text-green-700 border-green-200'
            >
              Verified Purchase
            </Badge>
          )}
        </div>
      </div>

      <h4 className='font-medium mb-1'>{title}</h4>
      <p className='text-sm text-muted-foreground'>{comment}</p>
    </div>
  )
}
