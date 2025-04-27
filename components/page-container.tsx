import { cn } from '@/lib/utils'
import { FC, HTMLAttributes, PropsWithChildren } from 'react'

export const PageContainer: FC<PropsWithChildren & { className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('container py-4 px-0 md:p-8', className)}>
      {children}
    </div>
  )
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

export const HomeSectionTitleContainer: FC<
  PropsWithChildren & { className?: string }
> = ({ children, className }) => (
  <div
    className={cn('flex flex-col gap-1 mb-8 text-center mx-auto', className)}
  >
    {children}
  </div>
)

export const HomeSectionTitle: FC<HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <h2
      className={cn(
        'text-3xl md:text-4xl font-bold tracking-tight dark:text-primary-foreground',
        className,
      )}
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
        'text-sm md:text-lg text-muted-foreground max-w-sm md:max-w-2xl mx-auto',
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  )
}
