'use client'

import { cn } from '@/lib/utils'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { ComponentProps, FC } from 'react'

const Separator: FC<ComponentProps<typeof SeparatorPrimitive.Root>> = ({
  className,
  ref,
  orientation = 'horizontal',
  decorative = true,
  ...props
}) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className,
    )}
    {...props}
  />
)

export { Separator }
