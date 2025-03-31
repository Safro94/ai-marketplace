'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LICENSE_TYPE } from '@/lib/constants'
import { LicenseOption } from '@/lib/types'
import { CheckCircle } from 'lucide-react'
import { FC, useState } from 'react'

interface Props {
  isLoading: boolean
  licenseOptions: LicenseOption[]
  onLicenseSelect: (licenseOption: LicenseOption) => void
}

export const LicenseSelector: FC<Props> = ({
  isLoading,
  licenseOptions,
  onLicenseSelect,
}) => {
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null)

  const handleLicenseSelect = (licenseOption: LicenseOption) => {
    setSelectedLicense(licenseOption.id)
    onLicenseSelect(licenseOption)
  }

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='h-8 w-48 bg-muted animate-pulse rounded' />

        <div className='grid  md:grid-cols-2 gap-4'>
          {[1, 2].map((i) => (
            <Card key={i} className='opacity-50'>
              <CardHeader>
                <div className='h-6 w-24 bg-muted animate-pulse rounded mb-2' />
                <div className='h-4 w-36 bg-muted animate-pulse rounded' />
                <div className='h-8 w-16 bg-muted animate-pulse rounded mt-2' />
              </CardHeader>

              <CardContent>
                <div className='space-y-2'>
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className='h-4 w-full bg-muted animate-pulse rounded'
                    />
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <div className='h-10 w-full bg-muted animate-pulse rounded' />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

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
        <h2 className='text-xl font-semibold'>License</h2>

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
      <h2 className='text-xl font-semibold'>Choose a License</h2>

      <div className='grid  md:grid-cols-2 gap-4'>
        {licenseOptions.map((option) => {
          const isExtended = option.licenseId === LICENSE_TYPE.EXTENDED
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
