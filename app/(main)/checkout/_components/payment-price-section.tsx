'use client'

import { useCart } from '@/contexts/cart-context'
import { formatCurrency } from '@/lib/utils'
import { FC } from 'react'

export const PaymentPriceSection: FC<{ cartTotal: number }> = ({
  cartTotal,
}) => {
  const { affiliateCode } = useCart()

  const discount = cartTotal * ((affiliateCode?.discount || 0) / 100)

  return (
    <>
      <div className='grid grid-cols-2 gap-2'>
        <span>Subtotal</span>
        <span className='text-right'>{formatCurrency(cartTotal)}</span>

        {affiliateCode?.discount && (
          <>
            <span>Discount</span>
            <span className='text-right'>{formatCurrency(discount)} </span>
          </>
        )}

        {/* <span className='flex items-center gap-1'>
            Service fee
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className='h-4 w-4 text-primary' />
                </TooltipTrigger>

                <TooltipContent>
                  <div>
                    This fee helps to maintain the platform, ensure secure
                    transactions,
                    <br /> provide customer support, and improve user
                    experience.
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>

          <span className='text-right'>{formatCurrency(serviceCharge)}</span> */}

        <span className='font-bold'>Total</span>
        <span className='text-right font-bold'>
          {formatCurrency(cartTotal - discount)}
        </span>
      </div>
    </>
  )
}
