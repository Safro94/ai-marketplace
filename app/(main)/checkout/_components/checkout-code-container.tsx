import { validateAffiliateCodeAction } from '@/actions/affiliate-codes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/contexts/cart-context'
import { CircleCheckBig, XIcon } from 'lucide-react'
import { useState } from 'react'

export const CheckoutCodeContainer = () => {
  const { affiliateCode: contextAffiliateCode, addOrClearAffiliateCode } =
    useCart()
  const [affiliateCode, setAffiliateCode] = useState('')

  const handleClick = async () => {
    if (!affiliateCode) return

    const { data, error } = await validateAffiliateCodeAction(affiliateCode)

    if (error) {
      toast.error('Error', {
        description: error || 'Code validation failed',
      })
      return
    }

    if (!data) {
      toast.error('Error', {
        description: 'Invalid code',
      })

      return
    }

    addOrClearAffiliateCode(data)
    setAffiliateCode('')

    toast.success('Success', {
      description: 'Code applied successfully',
    })
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
        <Input
          value={affiliateCode}
          placeholder='Enter your code'
          onChange={(e) => setAffiliateCode(e.target.value)}
        />

        <Button onClick={handleClick}>Apply</Button>
      </div>

      {contextAffiliateCode && (
        <div className='flex justify-between items-center p-4 border border-green-400 rounded-md'>
          <div className='flex gap-2'>
            <CircleCheckBig className='text-green-400' />

            <div className='flex items-center gap-2'>
              <span className='font-bold'>{contextAffiliateCode.code}</span>{' '}
              {contextAffiliateCode.discount && (
                <span className='text-xs'>
                  {contextAffiliateCode.discount}% off
                </span>
              )}
            </div>
          </div>

          <Button
            variant='ghost'
            onClick={() => {
              addOrClearAffiliateCode()
            }}
            className='text-red-500'
          >
            <XIcon className='w-4 h-4' /> Remove
          </Button>
        </div>
      )}
    </div>
  )
}
