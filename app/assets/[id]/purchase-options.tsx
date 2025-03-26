'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/toast'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/lib/constants'
import { createPurchase } from '@/lib/db/purchases'
import { Check, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

interface Props {
  id: string
  standardPrice: number
  extendedPrice?: number | null
}

interface FeatureProps {
  text: string
  isIncluded?: boolean
}

export const PurchaseOptions: FC<Props> = ({
  id,
  standardPrice,
  extendedPrice,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [licenseType, setLicenseType] = useState<'STANDARD' | 'EXTENDED'>(
    'STANDARD',
  )
  const { data: session } = useAuth()
  const router = useRouter()
  const user = session?.user

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to purchase this asset.',
      })

      router.push(
        `${ROUTES.login()}?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
      )
      return
    }

    setIsLoading(true)

    try {
      // Create purchase record
      await createPurchase({
        asset: { connect: { id: id } },
        buyer: { connect: { userId: user.id } },
        amount:
          licenseType === 'STANDARD'
            ? standardPrice
            : extendedPrice || standardPrice * 2,
        licenseType,
        status: 'COMPLETED',
      })

      toast.success('Purchase successful!', {
        description: 'You now have access to this asset.',
      })

      // Refresh the page to show download option
      router.refresh()
    } catch (error) {
      console.error('Purchase error:', error)

      toast.error('Purchase failed', {
        description:
          'There was an error processing your purchase. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='border-border/50'>
      <CardContent className='p-6'>
        <Tabs
          defaultValue='standard'
          onValueChange={(value) =>
            setLicenseType(value === 'standard' ? 'STANDARD' : 'EXTENDED')
          }
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='standard'>Standard</TabsTrigger>
            <TabsTrigger value='extended'>Extended</TabsTrigger>
          </TabsList>
          <TabsContent value='standard' className='pt-4'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-2xl font-bold'>${standardPrice}</span>
                <Badge variant='outline' className='text-xs'>
                  Most Popular
                </Badge>
              </div>
              <div className='space-y-2'>
                <Feature text='Single user license' />
                <Feature text='All templates included' />
                <Feature text='6 months of updates' />
                <Feature text='Basic implementation guide' />
                <Feature text='Community support' isIncluded={false} />
                <Feature text='Priority email support' isIncluded={false} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value='extended' className='pt-4'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-2xl font-bold'>
                  ${extendedPrice || standardPrice * 2}
                </span>
                <Badge variant='outline' className='text-xs'>
                  Best Value
                </Badge>
              </div>
              <div className='space-y-2'>
                <Feature text='Team license (up to 5 users)' />
                <Feature text='All templates included' />
                <Feature text='Lifetime updates' />
                <Feature text='Advanced implementation guide' />
                <Feature text='Community support' />
                <Feature text='Priority email support' />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className='px-6 pb-6 pt-0 flex justify-between'>
        <Button
          className='flex-1 mr-2'
          size='lg'
          onClick={handlePurchase}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className='flex items-center'>
              <svg
                className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className='flex items-center'>
              <ShoppingCart className='mr-2 h-5 w-5' />
              Buy Now
            </span>
          )}
        </Button>

        {/* <FavoriteButton assetId={id} /> */}
      </CardFooter>
    </Card>
  )
}

const Feature: FC<FeatureProps> = ({ text, isIncluded = true }) => {
  return (
    <div className='flex items-start'>
      {isIncluded ? (
        <Check className='h-4 w-4 text-primary mr-2 mt-0.5' />
      ) : (
        <div className='h-4 w-4 border-2 border-muted rounded-full mr-2 mt-0.5' />
      )}
      <span className={isIncluded ? '' : 'text-muted-foreground'}>{text}</span>
    </div>
  )
}

const Badge = ({
  variant,
  className,
  children,
}: {
  variant: 'outline' | 'secondary'
  className?: string
  children: React.ReactNode
}) => {
  return (
    <span
      className={`
      inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
      ${variant === 'outline' ? 'border border-primary text-primary' : 'bg-secondary text-secondary-foreground'}
      ${className || ''}
    `}
    >
      {children}
    </span>
  )
}
