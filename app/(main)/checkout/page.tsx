import { getCartItems } from '@/actions/cart'
import { PageContainer } from '@/components/page-container'
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb'
import { getCartTotal } from '@/lib/cart'
import { ROUTES } from '@/lib/constants'
import { redirect } from 'next/navigation'
import { CheckoutContainer } from './_components/checkout-container'

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
        <CheckoutContainer cartTotal={cartTotal} cartItems={cartItems} />
      </div>
    </PageContainer>
  )
}
