import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex items-center justify-center my-8'>
      <div className='text-center max-w-md'>
        <Image
          src='/not-found.svg'
          alt='404 not found image'
          width={800}
          height={600}
          className='mb-6'
        />

        <h2 className='text-2xl font-semibold text-foreground-800 mb-6'>
          Page Not Found
        </h2>

        <p className='text-foreground-600 mb-8'>
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          removed. If you believe this is an error, please contact our support
          team.
        </p>

        <Button asChild>
          <Link href={ROUTES.home()}>Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
