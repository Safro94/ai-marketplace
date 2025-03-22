import { cn } from '@/lib/utils'
import { ComponentProps, FC } from 'react'

const Skeleton: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

export { Skeleton }
