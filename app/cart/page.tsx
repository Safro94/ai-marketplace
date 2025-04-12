'use client'

import { CartItemSkeleton } from '@/components/cart-item-skeleton'
import { PageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/lib/constants'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PaymentPriceSection } from '../checkout/_components/payment-price-section'
import { CartItem } from './_components/cart-item'

export default function CartPage() {
  const { isLoading, items, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const handleCheckout = async () => {
    if (!user) {
      router.push(`${ROUTES.login()}?redirect=${ROUTES.cart()}`)
      return
    }

    router.push(ROUTES.checkout())
  }

  return (
    <PageContainer>
      <h1 className='text-3xl font-bold mb-8'>Your Cart</h1>

      <div className='grid md:grid-cols-3 gap-8'>
        <div className='md:col-span-2'>
          {isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className='w-full h-6' />
                </CardTitle>
              </CardHeader>

              <CardContent className='space-y-4'>
                {[...Array(1)].map((_, i) => (
                  <CartItemSkeleton key={i} />
                ))}
              </CardContent>

              <CardFooter className='flex justify-between'>
                <Skeleton className='w-24 h-10' />
                <Skeleton className='w-40 h-10' />
              </CardFooter>
            </Card>
          )}

          {!isLoading && !items.length && (
            <div className='text-center py-12 border rounded-lg'>
              <ShoppingBag className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <h2 className='text-xl font-medium mb-2'>Your cart is empty</h2>
              <p className='text-muted-foreground mb-6'>
                Browse the marketplace to find AI assets for your projects.
              </p>
            </div>
          )}

          {!isLoading && !!items.length && (
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({items.length})</CardTitle>
              </CardHeader>

              <CardContent className='space-y-4'>
                {items.map((item) => (
                  <CartItem key={item.assetId} {...item} />
                ))}
              </CardContent>

              <CardFooter className='flex justify-between'>
                <Button variant='outline' onClick={clearCart}>
                  Clear Cart
                </Button>

                <Button asChild variant='outline'>
                  <Link href={ROUTES.explore()}>Continue Shopping</Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div>
          {isLoading ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className='w-full h-5' />
                </CardTitle>
              </CardHeader>

              <CardContent className='space-y-4'>
                <PaymentPriceSection />
              </CardContent>

              <CardFooter>
                <Skeleton className='w-full h-10' />
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className='space-y-4'>
                <PaymentPriceSection />
              </CardContent>

              <CardFooter>
                <Button className='w-full' onClick={handleCheckout}>
                  Proceed to Checkout <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
