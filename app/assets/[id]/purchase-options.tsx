'use client'

import { FavoriteButton } from '@/components/favorite-button'
import { LoadingButton } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import { useCart } from '@/contexts/cart-context'
import { useAuth } from '@/hooks/use-auth'
import { API_ROUTES, LICENSE_TYPE, ROUTES } from '@/lib/constants'
import { LicenseOption } from '@/lib/types'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
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
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false)
  const [licenseType, setLicenseType] = useState<LicenseOption>()

  useEffect(() => {
    const fetchLicenseOptions = async () => {
      try {
        setIsLoadingLicenses(true)
        const response = await fetch(API_ROUTES.assetsLicenses(assetId))

        if (!response.ok) throw new Error('Failed to fetch license options')

        const data = await response.json()
        setLicenseOptions(data)

        // Auto-select the standard license if available
        const standardLicense = data.find(
          (option: LicenseOption) => option.licenseId === LICENSE_TYPE.STANDARD,
        )

        if (standardLicense) {
          setLicenseType(standardLicense)
        }
      } catch (error) {
        toast.error('Error', {
          description: 'Failed to load license options. Please try again.',
        })
      } finally {
        setIsLoadingLicenses(false)
      }
    }

    fetchLicenseOptions()
  }, [assetId])

  // const handlePurchase = async () => {
  //   if (!user) {
  //     toast.error('Authentication required', {
  //       description: 'Please log in to purchase this asset.',
  //     })

  //     router.push(
  //       `${ROUTES.login()}?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
  //     )
  //     return
  //   }

  //   setIsLoading(true)

  //   try {
  //     // Create purchase record
  //     await createPurchase({
  //       asset: { connect: { id: assetId } },
  //       buyer: { connect: { userId: user.id } },
  //       amount: licenseType!.price,
  //       status: PurchaseStatus.COMPLETED,
  //     })

  //     toast.success('Purchase successful!', {
  //       description: 'You now have access to this asset.',
  //     })

  //     // Refresh the page to show download option
  //     router.refresh()
  //   } catch (error) {
  //     console.error('Purchase error:', error)

  //     toast.error('Purchase failed', {
  //       description:
  //         'There was an error processing your purchase. Please try again.',
  //     })
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

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
      assetLicenseId: selectedOption.id,
      title: assetTitle,
      price: selectedOption.price,
      licenseName: selectedOption.name,
      image: assetImage,
    })
  }

  return (
    <Card className='border-border/50'>
      <CardContent className='p-6'>
        <LicenseSelector
          licenseOptions={licenseOptions}
          isLoading={isLoadingLicenses}
          onLicenseSelect={(licenseOption) => {
            setLicenseType(licenseOption)
          }}
        />
      </CardContent>

      <CardFooter className='px-6 pb-6 pt-0 flex justify-between'>
        <LoadingButton
          className='flex-1 mr-2'
          size='lg'
          onClick={handleAddToCart}
          disabled={!licenseType}
          isLoading={false}
        >
          <span className='flex items-center'>
            <ShoppingCart className='mr-2 h-5 w-5' />
            Add to Cart
          </span>
        </LoadingButton>

        <FavoriteButton assetId={assetId} />
      </CardFooter>
    </Card>
  )
}
