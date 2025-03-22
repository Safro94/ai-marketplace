'use client'

import { cn } from '@/lib/utils'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { ComponentProps, FC } from 'react'

const ScrollArea: FC<ComponentProps<typeof ScrollAreaPrimitive.Root>> = ({
  className,
  children,
  ref,
  ...props
}) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className='h-full w-full rounded-[inherit]'>
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
)

const ScrollBar: FC<
  ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
> = ({ className, orientation = 'vertical', ref, ...props }) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' &&
        'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className='relative flex-1 rounded-full bg-border' />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
)

export { ScrollArea, ScrollBar }
