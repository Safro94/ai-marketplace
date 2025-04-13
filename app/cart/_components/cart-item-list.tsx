'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCart } from '@/hooks/use-cart'
import { ROUTES } from '@/lib/constants'
import { CartItem } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

interface Props {
  cartItems: CartItem[]
  showContinueShopping?: boolean
}

export const CartItemList: FC<Props> = ({
  cartItems,
  showContinueShopping = true,
}) => {
  const { removeItem, isLoading } = useCart()

  return (
    <Card className='lg:col-span-2 flex-1'>
      <CardHeader>
        <CardTitle>Items</CardTitle>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col gap-4'>
          {cartItems.map((item) => (
            <Card
              key={`${item.assetId}-${item.assetLicenseId}`}
              className='overflow-hidden'
            >
              <CardContent className='p-4'>
                <div className='flex flex-col gap-4 md:items-center sm:flex-row'>
                  <div className='relative h-32 w-full md:h-16 md:w-16 rounded-md flex-shrink-0'>
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.title}
                      fill
                      className='object-cover'
                    />
                  </div>

                  <div className='flex-1'>
                    <div className='flex justify-between'>
                      <div>
                        <Link
                          href={ROUTES.assetsDetail(item.assetId)}
                          className='text-lg font-medium hover:underline'
                        >
                          {item.title}
                        </Link>

                        <p className='text-sm text-muted-foreground'>
                          License: {item.licenseName}
                        </p>
                      </div>

                      <div className='text-right flex items-center gap-2'>
                        <p className='font-medium'>
                          {formatCurrency(item.price)}
                        </p>

                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-destructive'
                          disabled={isLoading}
                          onClick={() =>
                            removeItem(item.assetId, item.assetLicenseId)
                          }
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>

      {showContinueShopping && (
        <CardFooter className='justify-end'>
          <Button asChild variant='outline'>
            <Link href={ROUTES.explore()}>Continue shopping</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
