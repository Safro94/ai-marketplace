import { formatCurrency } from '@/lib/utils'
import { FC } from 'react'

export const PaymentPriceSection: FC<{ cartTotal: number }> = ({
  cartTotal,
}) => {
  // const serviceCharge = getServiceCharge(totalPrice)
  const serviceCharge = 0
  const totalWithServiceCharge = cartTotal + serviceCharge

  return (
    <>
      <div className='grid grid-cols-2 gap-2'>
        <span>Subtotal</span>
        <span className='text-right'>{formatCurrency(cartTotal)}</span>

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
          {formatCurrency(totalWithServiceCharge)}
        </span>
      </div>
    </>
  )
}
