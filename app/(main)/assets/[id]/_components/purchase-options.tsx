'use client'

import { LoadingButton } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/lib/constants'
import { LicenseOption } from '@/lib/types'
import { LicenseType, PrimaryMediaType } from '@prisma/client'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, use, useState, useTransition } from 'react'
import { LicenseSelector } from './license-selector'

interface Props {
  assetId: string
  assetTitle: string
  assetImage: string
  getLicenses: Promise<{ data: LicenseOption[] }>
  primaryMediaType: PrimaryMediaType
}

export const PurchaseOptions: FC<Props> = ({
  assetId,
  assetImage,
  assetTitle,
  getLicenses,
  primaryMediaType,
}) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { user } = useAuth()
  const { addToCart } = useCart()
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
        description: 'Please log in to add items to your cart.',
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

    startTransition(async () => {
      await addToCart({
        assetId,
        primaryMediaType,
        title: assetTitle,
        primaryMedia: assetImage,
        price: selectedLicense.price,
        licenseName: selectedLicense.name,
        assetLicenseId: selectedLicense.licenseId,
      })

      toast.success('Added to cart', {
        description: `${assetTitle} has been added to your cart.`,
      })
    })
  }

  if (!selectedLicense?.price) return null

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
        {/* TODO: check if we should use AssetAddToCartButton */}
        <LoadingButton
          size='lg'
          onClick={handleAddToCart}
          disabled={!selectedLicense || isPending}
          isLoading={isPending}
          className='w-full'
        >
          <ShoppingCart className='mr-2 h-5 w-5' />
          Add to Cart
        </LoadingButton>
      </CardFooter>
    </Card>
  )
}
