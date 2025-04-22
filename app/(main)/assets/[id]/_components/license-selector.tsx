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
import { LicenseOption } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { LicenseType } from '@prisma/client'
import { CheckCircle } from 'lucide-react'
import { Dispatch, FC, SetStateAction } from 'react'

interface Props {
  licenseOptions: LicenseOption[]
  selectedLicense: LicenseOption | undefined
  setSelectedLicense: Dispatch<SetStateAction<LicenseOption | undefined>>
}

export const LicenseSelector: FC<Props> = ({
  licenseOptions,
  selectedLicense,
  setSelectedLicense,
}) => {
  const handleLicenseSelect = (licenseOption: LicenseOption) => {
    setSelectedLicense(licenseOption)
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
        <div className='flex justify-between'>
          <h2 className='text-xl font-semibold'>License</h2>
          <Badge variant='outline' className='flex-shrink-0 self-center'>
            non-refundable
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardHeaderItems
              name={option.name}
              description={option.description}
              price={option.price}
            />
          </CardHeader>

          <CardContent>
            <CardContentList features={option.features} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between'>
        <h2 className='text-xl font-semibold'>Choose a License</h2>
        <Badge variant='outline' className='flex-shrink-0 self-center'>
          non-refundable
        </Badge>
      </div>

      <div className='grid gap-4'>
        {licenseOptions.map((option) => {
          const isExtended = option.licenseId === LicenseType.EXTENDED
          const isSelected = selectedLicense?.id === option.id

          return (
            <Card
              key={option.id}
              className={`
                ${isSelected ? 'ring-2 ring-primary' : ''}
                transition-all hover:shadow-md
              `}
            >
              {isExtended && (
                <div className='bg-primary rounded-t-lg text-primary-foreground text-center py-1 text-sm font-medium'>
                  EXTENDED
                </div>
              )}

              <CardHeader>
                <CardHeaderItems
                  name={option.name}
                  description={option.description}
                  price={option.price}
                />
              </CardHeader>

              <CardContent>
                <CardContentList features={option.features} />
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

export const CardHeaderItems = ({
  name,
  description,
  price,
}: Pick<LicenseOption, 'name' | 'description' | 'price'>) => (
  <>
    <CardTitle>{name}</CardTitle>
    <CardDescription>{description}</CardDescription>

    <div className='mt-2 text-2xl font-bold'>{formatCurrency(price)}</div>
  </>
)

export const CardContentList = ({ features }: { features: string[] }) => (
  <ul className='space-y-2'>
    {features.map((feature, index) => (
      <li key={index} className='text-sm flex items-start'>
        <CheckCircle className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
        {feature}
      </li>
    ))}
  </ul>
)
