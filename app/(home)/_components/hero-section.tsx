import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import { getServerSession } from '@/lib/session'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const HeroSection = async () => {
  const session = await getServerSession()
  let profile

  if (session?.user) {
    profile = await getUserProfile(session?.user.id)
  }

  return (
    <section className='min-h-screen overflow-hidden bg-primary flex'>
      <div className='relative w-full bg-background flex'>
        <div className='hidden md:block absolute top-0 right-0 w-full h-full'>
          <svg
            className='absolute h-full w-full'
            preserveAspectRatio='none'
            viewBox='0 0 100 100'
          >
            <path
              d='M0,0 L50,0 Q65,30 50,50 Q35,70 50,100 L0,100 Z'
              className='fill-background'
            />
            <path
              d='M50,0 L100,0 L100,100 L50,100 Q65,70 50,50 Q35,30 50,0 Z'
              className='fill-primary'
            />
          </svg>
        </div>

        {/* Content container */}
        <div className='relative w-full z-20 grid md:grid-cols-2 grid-rows-[max-content] min-h-[600px]'>
          <Header
            classNames={{
              header:
                'col-span-2 !bg-transparent self-start !border-0 !backdrop-blur-none',
              container: 'px-8',
            }}
          />

          {/* Left side with illustrations */}
          <div className='p-8 md:p-12 flex flex-col'>
            <div className='flex-1 flex flex-col justify-center'>
              <span className='text-lg mb-1'>
                Discover our AI asset marketplace
              </span>

              <h1 className='text-5xl md:text-6xl font-bold text-primary leading-tight mb-6'>
                The marketplace for premium AI assets
              </h1>

              <p className='text-xl text-muted-foreground max-w-md'>
                Discover high-quality AI prompt systems, custom GPTs, and
                specialized tools created by experts.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                <Button size='lg' asChild>
                  <Link href={ROUTES.explore()}>
                    Explore Marketplace
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>

                <Button size='lg' variant='outline' asChild>
                  {isAdminOrCreator(profile) ? (
                    <Link href={ROUTES.creatorDashboard()}>
                      Go to Creator Dashboard
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Link>
                  ) : (
                    <Link href={ROUTES.creators()}>Become a Creator</Link>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right side with text content */}
          <div className='hidden md:flex items-center justify-center relative'>
            {/* Vector Container */}
            <div className='isometric-container transform scale-75 md:scale-90 lg:scale-100'>
              {/* Smartphone */}
              <div className='isometric-element smartphone'>
                <div className='phone-body'>
                  <div className='phone-screen' />
                  <div className='phone-button' />
                </div>
              </div>

              {/* Shopping Basket */}
              <div className='isometric-element basket z-20 right-0 -bottom-[30%]'>
                <div className='w-[120px] h-[80px] bg-[#6a2fbd] relative rounded-sm shadow-lg scale-[2]'>
                  <div className='basket-handle left-5' />
                  <div className='basket-handle right-5' />
                  <div className='basket-handle left-[3.4rem] !-top-[3.5rem] !h-[calc(100%-1px)] rotate-90' />

                  <div className='absolute inset-3 grid grid-cols-2 gap-1.5'>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className='z-20 bg-gray-300 rounded-sm' />
                    ))}
                  </div>
                </div>
              </div>

              {/* Credit Card */}
              <div className='isometric-element credit-card -top-32 -left-5 z-20'>
                <div className='card-body shadow-lg scale-[2] w-[140px] h-[90px] rounded-lg relative p-3'>
                  <div className='w-8 h-5 bg-[#ffd700] rounded-sm mb-3' />

                  <div className='grid grid-cols-4 gap-2'>
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className='h-3 bg-muted animate-pulse rounded-sm mb-3'
                      />
                    ))}
                  </div>

                  <div className='flex justify-self-end gap-1'>
                    <span className='bg-[#ff5555] w-4 h-4 rounded-full' />
                    <span className='bg-[#ffaa00] w-4 h-4 rounded-full' />
                  </div>
                </div>
              </div>

              {/* Chat Bubbles */}
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className={`isometric-element chat-bubble chat-bubble-${i + 1} rounded-lg bg-[#f0f0f0] shadow-lg p-2 z-20 w-[100px] h-[50px] -right-[15%]`}
                >
                  <div className='flex items-center gap-2 h-full'>
                    <div className='w-5 h-5 rounded-full bg-muted animate-pulse' />
                    <div className='flex-1 h-3 rounded-sm bg-muted animate-pulse' />
                  </div>
                </div>
              ))}

              {/* Social Icons */}
              {['✓', '♥', '👍', '📱'].map((item, i) => (
                <div
                  key={item}
                  className={`isometric-element social-icon social-icon-${i + 1}`}
                >
                  <div className='icon-content'>{item}</div>
                </div>
              ))}

              {/* Product Tiles */}
              <div className='flex justify-center mt-[35%]'>
                <div className='grid grid-cols-3 gap-1 w-[90px] h-[90px] scale-[3] z-20'>
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className='tile rounded-sm shadow-lg' />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
