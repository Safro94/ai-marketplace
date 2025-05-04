import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { getServerSession } from '@/lib/session'
import Link from 'next/link'

export const AffiliateCTASection = async () => {
  const session = await getServerSession()

  if (session?.user) return null

  return (
    <section className='py-16 px-4 md:px-6 lg:px-8 bg-primary text-white'>
      <div className='max-w-7xl mx-auto text-center'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
          Ready to Start Earning?
        </h2>

        <p className='text-xl mb-8 max-w-3xl mx-auto opacity-90'>
          Sign up to our platform today and start earning rewards for every
          referral you bring.
        </p>

        <Button size='lg' variant='secondary' asChild>
          <Link href={ROUTES.signUp()}>Sign Up Now</Link>
        </Button>
      </div>
    </section>
  )
}
