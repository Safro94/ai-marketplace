'use client'

import { PageContainer } from '@/components/page-container'
import { Button, LoadingButton } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/lib/constants'
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CartPage() {
  const { items, removeItem, clearCart, totalPrice } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    if (!user) {
      router.push(`${ROUTES.login()}?redirect=${ROUTES.cart()}`)
      return
    }

    setIsCheckingOut(true)

    // In a real implementation, you would:
    // 1. Create a checkout session with your payment processor
    // 2. Redirect to the checkout page
    // 3. Process the payment
    // 4. Create purchase records

    // For the MVP, we'll just simulate a successful checkout
    setTimeout(() => {
      clearCart()
      router.push(ROUTES.purchases())
    }, 2000)
  }

  if (!items.length) {
    return (
      <PageContainer>
        <h1 className='text-3xl font-bold mb-8'>Your Cart</h1>

        <div className='text-center py-12 border rounded-lg'>
          <ShoppingBag className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h2 className='text-xl font-medium mb-2'>Your cart is empty</h2>
          <p className='text-muted-foreground mb-6'>
            Browse the marketplace to find AI assets for your projects.
          </p>

          <Button asChild>
            <Link href={ROUTES.explore()}>Browse Marketplace</Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <h1 className='text-3xl font-bold mb-8'>Your Cart</h1>

      <div className='grid  md:grid-cols-3 gap-8'>
        <div className='md:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({items.length})</CardTitle>
            </CardHeader>

            <CardContent className='space-y-4'>
              {items.map((item) => (
                <div
                  key={`${item.assetId}-${item.assetLicenseId}`}
                  className='flex items-center space-x-4'
                >
                  <div className='relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0'>
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.title}
                      fill
                      className='object-cover'
                    />
                  </div>

                  <div className='flex-1 min-w-0'>
                    <Link href={ROUTES.assetsDetail(item.assetId)}>
                      <h3 className='font-medium truncate'>{item.title}</h3>
                    </Link>
                    <p className='text-sm text-muted-foreground'>
                      {item.licenseName}
                    </p>
                  </div>

                  <div className='text-right flex items-center gap-2'>
                    <div className='font-medium'>${item.price.toFixed(2)}</div>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-red-500'
                      onClick={() => removeItem(item.assetId, item.title)}
                    >
                      <Trash2 className='h-4 w-4' />
                      <span className='sr-only'>Remove</span>
                    </Button>
                  </div>
                </div>
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
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className='space-y-4'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <Separator />

              <div className='flex justify-between font-bold'>
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>

            <CardFooter>
              <LoadingButton
                className='w-full'
                onClick={handleCheckout}
                disabled={isCheckingOut}
                isLoading={isCheckingOut}
              >
                Checkout <ArrowRight className='ml-2 h-4 w-4' />
              </LoadingButton>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
