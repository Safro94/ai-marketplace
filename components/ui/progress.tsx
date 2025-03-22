'use client'

import { cn } from '@/lib/utils'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { ComponentProps, FC } from 'react'

const Progress: FC<ComponentProps<typeof ProgressPrimitive.Root>> = ({
  className,
  value,
  ref,
  ...props
}) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className='h-full w-full flex-1 bg-primary transition-all'
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
)

export { Progress }
