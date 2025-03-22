import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { ComponentProps, FC } from 'react'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Alert: FC<ComponentProps<'div'> & VariantProps<typeof alertVariants>> = ({
  className,
  variant,
  ref,
  ...props
}) => (
  <div
    ref={ref}
    role='alert'
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
)

const AlertTitle: FC<ComponentProps<'h5'>> = ({ className, ref, ...props }) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
)

const AlertDescription: FC<ComponentProps<'div'>> = ({
  className,
  ref,
  ...props
}) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
)

export { Alert, AlertDescription, AlertTitle }
