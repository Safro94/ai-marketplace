'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/lib/constants'
import { LicenseOption } from '@/lib/types'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, Suspense, useState } from 'react'
import { LicenseSelector } from './license-selector'

interface Props {
  assetId: string
  assetTitle: string
  assetImage: string
}

export const PurchaseOptions: FC<Props> = ({
  assetId,
  assetImage,
  assetTitle,
}) => {
  const { user } = useAuth()
  const router = useRouter()
  const { addItem } = useCart()

  const [licenseOptions, setLicenseOptions] = useState<LicenseOption[]>([])
  const [licenseType, setLicenseType] = useState<LicenseOption>()

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to purchase this asset.',
      })

      router.push(
        `${ROUTES.login()}?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
      )
      return
    }

    if (!licenseType) return

    const selectedOption = licenseOptions.find(
      (option) => option.licenseId === licenseType?.licenseId,
    )

    if (!selectedOption) {
      toast.error('Error', {
        description: 'No license found',
      })
      return
    }

    addItem({
      assetId,
      assetLicenseId: selectedOption.licenseId,
      title: assetTitle,
      price: selectedOption.price,
      licenseName: selectedOption.name,
      image: assetImage,
    })
  }

  return (
    <Card className='border-border/50'>
      <CardContent className='p-6'>
        <Suspense fallback={<div>loading...</div>}>
          <LicenseSelector
            assetId={assetId}
            licenseOptions={licenseOptions}
            onLicenseSelect={setLicenseType}
            onLicensesFetch={setLicenseOptions}
          />
        </Suspense>
      </CardContent>

      <CardFooter className='px-6 pb-6 pt-0 flex flex-col gap-2'>
        <Button
          size='lg'
          onClick={handleAddToCart}
          disabled={!licenseType}
          className='w-full'
        >
          <span className='flex items-center'>
            <ShoppingCart className='mr-2 h-5 w-5' />
            Add to Cart
          </span>
        </Button>
      </CardFooter>
    </Card>
  )
}
