import { ROUTES } from '@/lib/constants'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { FC, PropsWithChildren, ReactNode } from 'react'
import { Logo } from '../logo'

interface Props extends PropsWithChildren {
  title: string
  description: string
  footer: ReactNode
}

export const AuthFormPanel: FC<Props> = ({
  children,
  footer,
  title,
  description,
}) => {
  return (
    <div className='flex justify-center items-center p-4'>
      <div className='w-full max-w-md'>
        <div className='mb-8'>
          <Link
            href={ROUTES.home()}
            className='flex items-center text-primary dark:text-primary-foreground text-sm font-semibold gap-2'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to home
          </Link>
        </div>

        <div className='text-center'>
          <div className='inline-flex items-center justify-center'>
            <Logo size='lg' showBeta={false} />
          </div>

          <div className='mb-10'>
            <h1 className='mt-6 text-2xl font-bold dark:text-primary-foreground'>
              {title}
            </h1>
            <p className='mt-2 text-sm text-muted-foreground'>{description}</p>
          </div>

          {children}

          <div className='mt-6 text-center text-sm'>{footer}</div>
        </div>
      </div>
    </div>
  )
}
