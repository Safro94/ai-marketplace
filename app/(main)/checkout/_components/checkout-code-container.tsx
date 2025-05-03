import { validateAffiliateCodeAction } from '@/actions/affiliate-codes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/contexts/cart-context'
import { useState } from 'react'

export const CheckoutCodeContainer = () => {
  const { addOrClearAffiliateCode } = useCart()
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

    addOrClearAffiliateCode(affiliateCode)

    toast.success('Success', {
      description: 'Code applied successfully',
    })
  }

  return (
    <div className='flex flex-col items-center gap-4 md:flex-row'>
      <Input
        value={affiliateCode}
        placeholder='Enter your code'
        className='w-full md:w-1/2'
        onChange={(e) => setAffiliateCode(e.target.value)}
      />

      <Button onClick={handleClick}>Apply</Button>
    </div>
  )
}
