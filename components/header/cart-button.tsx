import { getCartItemsCount } from '@/actions/cart'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export const CartButton = async () => {
  const itemCount = await getCartItemsCount()

  return (
    <Button variant='outline' size='sm' asChild className='relative'>
      <Link href={ROUTES.cart()}>
        <ShoppingCart className='h-4 w-4' />
        {itemCount > 0 && (
          <span className='absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center'>
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}
