'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import { CartItem as CartItemType } from '@/lib/types'
import Link from 'next/link'
import { FC } from 'react'
import { CartItem } from './cart-item'
interface Props {
  cartItems: CartItemType[]
  showActions?: boolean
}

export const CartItemList: FC<Props> = ({ cartItems, showActions = true }) => {
  return (
    <Card className='lg:col-span-2 flex-1'>
      <CardHeader>
        <CardTitle>Items</CardTitle>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col gap-4'>
          {cartItems.map((item) => (
            <CartItem
              key={item.assetId}
              item={item}
              showActions={showActions}
            />
          ))}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className='justify-end'>
          <Button asChild variant='outline'>
            <Link href={ROUTES.explore()}>Continue shopping</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
