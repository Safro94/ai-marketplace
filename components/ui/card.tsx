import { cn } from '@/lib/utils'
import { ComponentProps, FC } from 'react'

const Card: FC<ComponentProps<'div'>> = ({ className, ref, ...props }) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className,
    )}
    {...props}
  />
)

const CardHeader: FC<ComponentProps<'div'>> = ({
  className,
  ref,
  ...props
}) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
)

const CardTitle: FC<ComponentProps<'div'>> = ({ className, ref, ...props }) => (
  <div
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
)

const CardDescription: FC<ComponentProps<'div'>> = ({
  className,
  ref,
  ...props
}) => (
  <div
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
)

const CardContent: FC<ComponentProps<'div'>> = ({
  className,
  ref,
  ...props
}) => <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />

const CardFooter: FC<ComponentProps<'div'>> = ({
  className,
  ref,
  ...props
}) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
)

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
