import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CartItem } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { FC } from 'react'

interface Props {
  items: CartItem[]
  total: number
}

export const CheckoutSummary: FC<Props> = ({ items, total }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>

      <CardContent className='space-y-4'>
        {items.map((item) => (
          <div
            key={`${item.assetId}-${item.assetLicenseId}`}
            className='flex justify-between'
          >
            <div>
              <p className='font-medium'>{item.title}</p>
              <p className='text-sm text-muted-foreground'>
                {item.licenseName}
              </p>
            </div>
            <p className='font-medium'>{formatCurrency(item.price)}</p>
          </div>
        ))}

        <div className='border-t pt-4 flex justify-between font-bold'>
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
