import { Avatar } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { FC } from 'react'

export const AssetDetailCreatorInfo: FC<{
  className?: string
  name: string
  bio: string | null
}> = ({ className, name, bio }) => (
  <Card className={cn('hidden lg:block border-border/50', className)}>
    <CardContent className='p-6'>
      <div className='flex items-center space-x-4 mb-4'>
        <Avatar
          className='h-12 w-12'
          src={name || '/placeholder.svg?height=40&width=40'}
          alt={name || 'Creator'}
          fallback={(name || 'C').charAt(0)}
        />

        <div>
          <h3 className='font-semibold'>{name || 'Unknown Creator'}</h3>
          <p className='text-sm text-muted-foreground'>Creator</p>
        </div>
      </div>

      <p className='text-sm mb-4'>{bio || 'No bio available'}</p>
    </CardContent>
  </Card>
)
