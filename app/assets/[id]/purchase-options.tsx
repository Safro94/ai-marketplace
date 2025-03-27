'use client'

import { FavoriteButton } from '@/components/favorite-button'
import { LoadingButton } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/toast'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/lib/constants'
import { createPurchase } from '@/lib/db/purchases'
import { LicenseType, PurchaseStatus } from '@prisma/client'
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
  const [licenseType, setLicenseType] = useState<LicenseType>(
    LicenseType.STANDARD,
  )
  const { user } = useAuth()
  const router = useRouter()

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
        licenseType,
        asset: { connect: { id: id } },
        buyer: { connect: { userId: user.id } },
        amount:
          licenseType === LicenseType.STANDARD
            ? standardPrice
            : extendedPrice || standardPrice * 2,
        status: PurchaseStatus.COMPLETED,
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
          defaultValue={LicenseType.STANDARD}
          onValueChange={(value) => setLicenseType(value as LicenseType)}
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value={LicenseType.STANDARD}>Standard</TabsTrigger>
            <TabsTrigger value={LicenseType.EXTENDED}>Extended</TabsTrigger>
          </TabsList>

          <TabsContent value={LicenseType.STANDARD} className='pt-4'>
            <License
              price={standardPrice}
              badgeText='Most Popular'
              features={[
                { text: 'Single user license' },
                { text: 'All templates included' },
                { text: '6 months of updates' },
                { text: 'Basic implementation guide' },
                { text: 'Community support', isIncluded: false },
                { text: 'Priority email support', isIncluded: false },
              ]}
            />
          </TabsContent>

          <TabsContent value={LicenseType.EXTENDED} className='pt-4'>
            <License
              price={extendedPrice || standardPrice * 2}
              badgeText='Best Value'
              features={[
                { text: 'Team license (up to 5 users)' },
                { text: 'All templates included' },
                { text: 'Lifetime updates' },
                { text: 'Advanced implementation guide' },
                { text: 'Community support' },
                { text: 'Priority email support' },
              ]}
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className='px-6 pb-6 pt-0 flex justify-between'>
        <LoadingButton
          className='flex-1 mr-2'
          size='lg'
          onClick={handlePurchase}
          disabled={isLoading}
          isLoading={isLoading}
        >
          <span className='flex items-center'>
            <ShoppingCart className='mr-2 h-5 w-5' />
            Buy Now
          </span>
        </LoadingButton>

        <FavoriteButton assetId={id} />
      </CardFooter>
    </Card>
  )
}

const License = ({
  price,
  badgeText,
  features,
}: {
  price: number
  badgeText: string
  features: { text: string; isIncluded?: boolean }[]
}) => (
  <div className='space-y-4'>
    <div className='flex items-center justify-between'>
      <span className='text-2xl font-bold'>${price}</span>

      <Badge variant='outline' className='text-xs'>
        {badgeText}
      </Badge>
    </div>

    <div className='space-y-2'>
      {features.map(({ text, isIncluded = true }) => (
        <Feature key={text} text={text} isIncluded={isIncluded} />
      ))}
    </div>
  </div>
)

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
