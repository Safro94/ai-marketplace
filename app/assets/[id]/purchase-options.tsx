'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/lib/constants'
import { LicenseOption } from '@/lib/types'
import { LicenseType } from '@prisma/client'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, use, useState } from 'react'
import { LicenseSelector } from './license-selector'

interface Props {
  assetId: string
  assetTitle: string
  assetImage: string
  getLicenses: Promise<{ data: LicenseOption[] }>
}

export const PurchaseOptions: FC<Props> = ({
  assetId,
  assetImage,
  assetTitle,
  getLicenses,
}) => {
  const { user } = useAuth()
  const router = useRouter()
  const { addItem } = useCart()
  const { data: licenseOptions } = use(getLicenses)

  // Auto-select the standard license if available
  const standardLicense = licenseOptions.find(
    (option: LicenseOption) => option.licenseId === LicenseType.STANDARD,
  )

  const [selectedLicense, setSelectedLicense] = useState<
    LicenseOption | undefined
  >(standardLicense)

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

    if (!selectedLicense) {
      toast.error('Error', {
        description: 'No license found',
      })
      return
    }

    addItem({
      assetId,
      assetLicenseId: selectedLicense.licenseId,
      title: assetTitle,
      price: selectedLicense.price,
      licenseName: selectedLicense.name,
      image: assetImage,
    })
  }

  return (
    <Card className='border-border/50'>
      <CardContent className='p-6'>
        <LicenseSelector
          licenseOptions={licenseOptions}
          selectedLicense={selectedLicense}
          setSelectedLicense={setSelectedLicense}
        />
      </CardContent>

      <CardFooter className='px-6 pb-6 pt-0 flex flex-col gap-2'>
        <Button
          size='lg'
          onClick={handleAddToCart}
          disabled={!selectedLicense}
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
