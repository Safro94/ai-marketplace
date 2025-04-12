import { PageContainer } from '@/components/page-container'
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ROUTES } from '@/lib/constants'
import { getUserProfile } from '@/lib/db/users'
import { validateSession } from '@/lib/session'
import { CreditCard, ShoppingCart } from 'lucide-react'
import { redirect } from 'next/navigation'
import { CartSummary } from './_components/cart-summary'
import { PaymentPriceSection } from './_components/payment-price-section'
import { PaypalButtons } from './_components/paypal-buttons'

export default async function CheckoutPage() {
  const { user } = await validateSession(ROUTES.checkout())
  const profile = await getUserProfile(user.id)
  if (!profile) redirect(ROUTES.home())

  return (
    <PageContainer>
      <div className='flex flex-col gap-4 mb-8'>
        <BreadcrumbNavigation
          items={[
            {
              text: 'Cart',
              link: ROUTES.cart(),
            },
            {
              text: 'Checkout',
            },
          ]}
        />
        <h1 className='text-3xl font-bold'>Checkout</h1>
        <p className='text-muted-foreground'>Complete your purchase</p>
      </div>

      <div className='grid md:grid-cols-3 gap-8'>
        {/* Cart Summary Section */}
        <div className='space-y-6 flex flex-col col-span-2'>
          <div className='flex items-center gap-2'>
            <ShoppingCart className='h-5 w-5' />
            <h2 className='text-xl font-semibold'>Your Cart</h2>
          </div>

          <CartSummary />
        </div>

        {/* Payment Section */}
        <div className='space-y-6 flex flex-col'>
          <div className='flex items-center gap-2'>
            <CreditCard className='h-5 w-5' />
            <h2 className='text-xl font-semibold'>Payment</h2>
          </div>

          <Card className='min-h-[407px]'>
            <CardHeader>
              <CardTitle>Complete Payment</CardTitle>
              <CardDescription>
                Secure payment processing by PayPal
              </CardDescription>
            </CardHeader>

            <CardContent className='space-y-4 flex-1'>
              <PaymentPriceSection />

              <Separator />

              <div className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                  By completing this purchase, you agree to our Terms of Service
                  and Privacy Policy.
                </p>

                <PaypalButtons />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
