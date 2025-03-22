import { cn } from '@/lib/utils'
import { ComponentProps, FC } from 'react'

const Table: FC<ComponentProps<'table'>> = ({ className, ref, ...props }) => (
  <div className='relative w-full overflow-auto'>
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
)

const TableHeader: FC<ComponentProps<'thead'>> = ({
  className,
  ref,
  ...props
}) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
)

const TableBody: FC<ComponentProps<'tbody'>> = ({
  className,
  ref,
  ...props
}) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
)

const TableFooter: FC<ComponentProps<'tfoot'>> = ({
  className,
  ref,
  ...props
}) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
)

const TableRow: FC<ComponentProps<'tr'>> = ({ className, ref, ...props }) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className,
    )}
    {...props}
  />
)

const TableHead: FC<ComponentProps<'th'>> = ({ className, ref, ...props }) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
)

const TableCell: FC<ComponentProps<'td'>> = ({ className, ref, ...props }) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
)

const TableCaption: FC<ComponentProps<'caption'>> = ({
  className,
  ref,
  ...props
}) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
)

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
