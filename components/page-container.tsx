import { cn } from '@/lib/utils'
import { FC, HTMLAttributes, PropsWithChildren } from 'react'

export const PageContainer: FC<PropsWithChildren & { className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('container py-8', className)}>{children}</div>
}

export const HomeSection: FC<
  PropsWithChildren & HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...rest }) => {
  return (
    <section
      className={cn('px-8 py-16 overflow-hidden relative', className)}
      {...rest}
    >
      {children}
    </section>
  )
}

export const HomeSectionTitle: FC<HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <h2
      className={cn('text-5xl font-semibold tracking-tight', className)}
      {...rest}
    >
      {children}
    </h2>
  )
}

export const HomeSectionDescription: FC<
  HTMLAttributes<HTMLParagraphElement>
> = ({ children, className, ...rest }) => {
  return (
    <p
      className={cn(
        'text-lg text-muted-foreground max-w-2xl mx-auto',
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  )
}
