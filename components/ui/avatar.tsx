'use client'

import { cn } from '@/lib/utils'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { ComponentProps, FC } from 'react'

const Avatar: FC<ComponentProps<'span'>> = ({ className, ref, ...props }) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className,
    )}
    {...props}
  />
)

const AvatarImage: FC<ComponentProps<typeof AvatarPrimitive.Image>> = ({
  className,
  ref,
  ...props
}) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
)

const AvatarFallback: FC<ComponentProps<typeof AvatarPrimitive.Fallback>> = ({
  className,
  ref,
  ...props
}) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
)

export { Avatar, AvatarFallback, AvatarImage }
