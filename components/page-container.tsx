import { cn } from '@/lib/utils'
import { FC, PropsWithChildren } from 'react'

export const PageContainer: FC<PropsWithChildren & { className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('container py-8', className)}>{children}</div>
}
