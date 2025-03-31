import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { ComponentProps, FC, Fragment } from 'react'

interface Props {
  items: {
    text: string
    link?: string
  }[]
}

export const BreadcrumbNavigation: FC<Props> = ({ items }) => {
  return (
    <Breadcrumb className='mb-4'>
      <BreadcrumbList>
        {items.map((item, i) => {
          const isLastItem = i === items.length - 1

          return (
            <Fragment key={i}>
              <BreadcrumbItem>
                {isLastItem ? (
                  <BreadcrumbPage>{item.text}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.link}>{item.text}</BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLastItem && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

const Breadcrumb: FC<ComponentProps<'nav'>> = ({ ref, ...props }) => (
  <nav ref={ref} aria-label='breadcrumb' {...props} />
)

const BreadcrumbList: FC<ComponentProps<'ol'>> = ({
  className,
  ref,
  ...props
}) => (
  <ol
    ref={ref}
    className={cn(
      'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
      className,
    )}
    {...props}
  />
)

const BreadcrumbItem: FC<ComponentProps<'li'>> = ({
  className,
  ref,
  ...props
}) => (
  <li
    ref={ref}
    className={cn('inline-flex items-center gap-1.5', className)}
    {...props}
  />
)

const BreadcrumbLink: FC<ComponentProps<'a'> & { asChild?: boolean }> = ({
  asChild,
  className,
  ref,
  ...props
}) => {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      ref={ref}
      className={cn('transition-colors hover:text-foreground', className)}
      {...props}
    />
  )
}

const BreadcrumbPage: FC<ComponentProps<'span'>> = ({
  className,
  ref,
  ...props
}) => (
  <span
    ref={ref}
    role='link'
    aria-disabled='true'
    aria-current='page'
    className={cn('font-normal text-foreground', className)}
    {...props}
  />
)

const BreadcrumbSeparator: FC<ComponentProps<'li'>> = ({
  children,
  className,
  ...props
}) => (
  <li
    role='presentation'
    aria-hidden='true'
    className={cn('[&>svg]:w-3.5 [&>svg]:h-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)

const BreadcrumbEllipsis: FC<ComponentProps<'span'>> = ({
  className,
  ...props
}) => (
  <span
    role='presentation'
    aria-hidden='true'
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className='h-4 w-4' />
    <span className='sr-only'>More</span>
  </span>
)

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
