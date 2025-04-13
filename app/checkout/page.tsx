import { getCartItems } from '@/actions/cart'
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
import { getCartTotal } from '@/lib/cart'
import { ROUTES } from '@/lib/constants'
import { redirect } from 'next/navigation'
import { CartItemList } from '../cart/_components/cart-item-list'
import { PaymentPriceSection } from './_components/payment-price-section'
import { PaypalButtons } from './_components/paypal-buttons'

export default async function CheckoutPage() {
  const cartItems = await getCartItems()
  const cartTotal = await getCartTotal()

  if (!cartItems.length) {
    redirect(ROUTES.cart())
  }

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
        <CartItemList cartItems={cartItems} showContinueShopping={false} />

        {/* Payment Section */}
        <div className='flex flex-col gap-4'>
          <Card className='min-h-[407px]'>
            <CardHeader>
              <CardTitle>Complete Payment</CardTitle>
              <CardDescription>
                Secure payment processing by PayPal
              </CardDescription>
            </CardHeader>

            <CardContent className='space-y-4 flex-1'>
              <PaymentPriceSection cartTotal={cartTotal} />

              <Separator />

              <div className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                  By completing this purchase, you agree to our Terms of Service
                  and Privacy Policy.
                </p>

                <PaypalButtons cartItems={cartItems} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
