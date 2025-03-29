'use client'

import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export default function CartButton() {
  const { totalItems } = useCart()

  return (
    <Button variant='outline' size='sm' asChild className='relative'>
      <Link href='/cart'>
        <ShoppingCart className='h-4 w-4 mr-2' />
        Cart
        {totalItems > 0 && (
          <>
            <span className='ml-1'>({totalItems})</span>
            <span className='absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center'>
              {totalItems}
            </span>
          </>
        )}
      </Link>
    </Button>
  )
}
