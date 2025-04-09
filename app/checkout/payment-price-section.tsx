'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useCart } from '@/contexts/cart-context'
import { formatCurrency, getServiceCharge } from '@/lib/utils'
import { InfoIcon } from 'lucide-react'

export const PaymentPriceSection = () => {
  const { totalPrice } = useCart()

  const serviceCharge = getServiceCharge(totalPrice)
  const totalWithServiceCharge = totalPrice + serviceCharge

  return (
    <div className='grid grid-cols-2 gap-2'>
      <span>Subtotal</span>
      <span className='text-right'>${totalPrice.toFixed(2)}</span>

      <span className='flex items-center gap-1'>
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
                <br /> provide customer support, and improve user experience.
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>

      <span className='text-right'>{formatCurrency(serviceCharge)}</span>

      <span className='font-bold'>Total</span>
      <span className='text-right font-bold'>
        {formatCurrency(totalWithServiceCharge)}
      </span>
    </div>
  )
}
