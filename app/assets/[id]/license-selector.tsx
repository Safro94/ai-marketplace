'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import { API_ROUTES } from '@/lib/constants'
import { LicenseOption } from '@/lib/types'
import { LicenseType } from '@prisma/client'
import { CheckCircle } from 'lucide-react'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

interface Props {
  assetId: string
  licenseOptions: LicenseOption[]
  onLicenseSelect: Dispatch<SetStateAction<LicenseOption | undefined>>
  onLicensesFetch: Dispatch<SetStateAction<LicenseOption[]>>
}

export const LicenseSelector: FC<Props> = ({
  assetId,
  licenseOptions,
  onLicenseSelect,
  onLicensesFetch,
}) => {
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null)
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(
    !licenseOptions.length,
  )

  useEffect(() => {
    const fetchLicenseOptions = async () => {
      try {
        setIsLoadingLicenses(true)
        const response = await fetch(API_ROUTES.assetsLicenses(assetId))

        if (!response.ok) throw new Error('Failed to fetch license options')

        const data = await response.json()
        onLicensesFetch(data)

        // Auto-select the standard license if available
        const standardLicense = data.find(
          (option: LicenseOption) => option.licenseId === LicenseType.STANDARD,
        )

        if (standardLicense) {
          onLicenseSelect(standardLicense)
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
  }, [assetId, onLicenseSelect, onLicensesFetch])

  const handleLicenseSelect = (licenseOption: LicenseOption) => {
    setSelectedLicense(licenseOption.id)
    onLicenseSelect(licenseOption)
  }

  // if (isLoadingLicenses) {
  //   return (
  //     <div className='space-y-4'>
  //       <Skeleton className='h-8 w-48 bg-muted animate-pulse rounded' />

  //       <div className='grid gap-4'>
  //         {[1, 2].map((i) => (
  //           <Card key={i} className='opacity-50'>
  //             <CardHeader>
  //               <Skeleton className='h-6 w-24 mb-2' />
  //               <Skeleton className='h-4 w-36' />
  //               <Skeleton className='h-8 w-16 mt-2' />
  //             </CardHeader>

  //             <CardContent>
  //               <div className='space-y-2'>
  //                 {[1, 2, 3, 4].map((j) => (
  //                   <Skeleton key={j} className='h-4 w-full ' />
  //                 ))}
  //               </div>
  //             </CardContent>

  //             <CardFooter>
  //               <Skeleton className='h-10 w-full ' />
  //             </CardFooter>
  //           </Card>
  //         ))}
  //       </div>
  //     </div>
  //   )
  // }

  if (!licenseOptions.length) {
    return (
      <Card>
        <CardContent className='p-6'>
          <p className='text-center text-muted-foreground'>
            No license options available for this asset.
          </p>
        </CardContent>
      </Card>
    )
  }

  // If there's only one license option, just show it without selection UI
  if (licenseOptions.length === 1) {
    const option = licenseOptions[0]

    return (
      <div className='space-y-4'>
        <div className='flex justify-between'>
          <h2 className='text-xl font-semibold'>License</h2>
          <Badge variant='outline'>non-refundable</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{option.name}</CardTitle>
            <CardDescription>{option.description}</CardDescription>

            <div className='mt-2 text-2xl font-bold'>
              ${option.price.toFixed(2)}
            </div>
          </CardHeader>

          <CardContent>
            <ul className='space-y-2'>
              {option.features.map((feature, index) => (
                <li key={index} className='text-sm flex items-start'>
                  <CheckCircle className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between'>
        <h2 className='text-xl font-semibold'>Choose a License</h2>
        <Badge variant='outline'>non-refundable</Badge>
      </div>

      <div className='grid gap-4'>
        {licenseOptions.map((option) => {
          const isExtended = option.licenseId === LicenseType.EXTENDED
          const isSelected = selectedLicense === option.id

          return (
            <Card
              key={option.id}
              className={`
                ${isExtended ? 'border-primary' : ''}
                ${isSelected ? 'ring-2 ring-primary' : ''}
                transition-all hover:shadow-md
              `}
            >
              {isExtended && (
                <div className='bg-primary text-primary-foreground text-center py-1 text-sm font-medium'>
                  EXTENDED
                </div>
              )}

              <CardHeader>
                <CardTitle>{option.name}</CardTitle>
                <CardDescription>{option.description}</CardDescription>

                <div className='mt-2 text-2xl font-bold'>
                  ${option.price.toFixed(2)}
                </div>
              </CardHeader>

              <CardContent>
                <ul className='space-y-2'>
                  {option.features.map((feature, index) => (
                    <li key={index} className='text-sm flex items-start'>
                      <CheckCircle className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className='w-full'
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => handleLicenseSelect(option)}
                >
                  {isSelected ? 'Selected' : `Select ${option.name}`}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
