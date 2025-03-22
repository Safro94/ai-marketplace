import { ButtonProps, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { ComponentProps, FC } from 'react'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const Pagination: FC<ComponentProps<'nav'>> = ({ className, ...props }) => (
  <nav
    role='navigation'
    aria-label='pagination'
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)

const PaginationContent: FC<ComponentProps<'ul'>> = ({
  className,
  ref,
  ...props
}) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
)

const PaginationItem: FC<ComponentProps<'li'>> = ({
  className,
  ref,
  ...props
}) => <li ref={ref} className={cn('', className)} {...props} />

const PaginationLink: FC<PaginationLinkProps> = ({
  className,
  isActive,
  size = 'icon',
  ...props
}) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className,
    )}
    {...props}
  />
)

const PaginationPrevious: FC<ComponentProps<typeof PaginationLink>> = ({
  className,
  ...props
}) => (
  <PaginationLink
    aria-label='Go to previous page'
    size='default'
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className='h-4 w-4' />
    <span>Previous</span>
  </PaginationLink>
)

const PaginationNext: FC<ComponentProps<typeof PaginationLink>> = ({
  className,
  ...props
}) => (
  <PaginationLink
    aria-label='Go to next page'
    size='default'
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className='h-4 w-4' />
  </PaginationLink>
)

const PaginationEllipsis: FC<ComponentProps<'span'>> = ({
  className,
  ...props
}) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className='h-4 w-4' />
    <span className='sr-only'>More pages</span>
  </span>
)

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
