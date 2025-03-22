'use client'

import { LoadingButton } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Check, ShoppingCart } from 'lucide-react'
import { FC, useState } from 'react'
import { useSupabase } from '../../supabase-provider'

interface Asset {
  id: number
  title: string
  price: number
}

interface Props {
  asset: Asset
}

interface FeatureProps {
  text: string
  isIncluded?: boolean
}

interface BadgeProps {
  variant: 'outline' | 'secondary'
  className?: string
  children: React.ReactNode
}

export const PurchaseOptions: FC<Props> = ({ asset }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useSupabase()

  const handlePurchase = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to purchase this asset.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: 'Purchase successful!',
        description: 'You now have access to this asset.',
      })
    }, 1500)
  }

  return (
    <Card className='border-border/50'>
      <CardContent className='p-6'>
        <Tabs defaultValue='standard'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='standard'>Standard</TabsTrigger>
            <TabsTrigger value='extended'>Extended</TabsTrigger>
          </TabsList>

          <TabsContent value='standard' className='pt-4'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-2xl font-bold'>${asset.price}</span>
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
                <span className='text-2xl font-bold'>${asset.price * 2}</span>

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

      <CardFooter className='px-6 pb-6 pt-0'>
        <LoadingButton
          className='w-full'
          size='lg'
          isLoading={isLoading}
          onClick={handlePurchase}
          disabled={isLoading}
        >
          <span className='flex items-center'>
            <ShoppingCart className='mr-2 h-5 w-5' />
            Buy Now
          </span>
        </LoadingButton>
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

const Badge: FC<BadgeProps> = ({ variant, className, children }) => {
  return (
    <span
      className={`
      inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
      ${
        variant === 'outline'
          ? 'border border-primary text-primary'
          : 'bg-secondary text-secondary-foreground'
      }
      ${className || ''}
    `}
    >
      {children}
    </span>
  )
}
