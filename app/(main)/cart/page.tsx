import { getCartItems } from '@/actions/cart'
import { PageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { getCartTotal } from '@/lib/cart'
import { ROUTES } from '@/lib/constants'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { CartItemList } from './_components/cart-item-list'
import { CartSummary } from './_components/cart-summary'

export default async function CartPage() {
  const cartItems = await getCartItems()
  const cartTotal = await getCartTotal()

  return (
    <PageContainer>
      <h1 className='text-3xl font-bold mb-8'>Your Cart</h1>

      {!cartItems.length ? (
        <div className='flex flex-col items-center justify-center py-12'>
          <div className='bg-muted rounded-full p-6 mb-6'>
            <ShoppingCart className='h-12 w-12 text-muted-foreground' />
          </div>

          <h2 className='text-2xl font-bold mb-2'>Your cart is empty</h2>

          <p className='text-muted-foreground mb-6 text-center max-w-md'>
            Looks like you haven&apos;t added any AI assets to your cart yet.
            Browse our marketplace to find the perfect assets for your needs.
          </p>

          <Button asChild size='lg'>
            <Link href={ROUTES.explore()}>Browse AI Assets</Link>
          </Button>
        </div>
      ) : (
        <div className='grid lg:grid-cols-3 gap-8'>
          <CartItemList cartItems={cartItems} />
          <CartSummary cartItems={cartItems} cartTotal={cartTotal} />
        </div>
      )}
    </PageContainer>
  )
}
