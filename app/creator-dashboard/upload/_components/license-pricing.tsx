'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { API_ROUTES } from '@/lib/constants'
import { assetUploadSchema } from '@/lib/schemas'
import { LicenseOption } from '@/lib/types'
import { License, LicenseType } from '@prisma/client'
import { CheckCircle } from 'lucide-react'
import { FC, PropsWithChildren, useEffect, useState } from 'react'
import {
  Control,
  useFieldArray,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form'
import { z } from 'zod'

type FormData = z.infer<typeof assetUploadSchema>

interface Props {
  control: Control<FormData>
  setValue: UseFormSetValue<FormData>
}

const MULTIPLIER = 5

export const LicensePricing: FC<Props> = ({ setValue, control }) => {
  const [licenses, setLicenses] = useState<License[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'licenses',
  })

  const watchedLicenses = useWatch({
    name: 'licenses',
    control,
  })

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(API_ROUTES.licenses())

        if (response.ok) {
          const data = await response.json()
          setLicenses(data)
        }
      } catch (error) {
        console.error('Error fetching licenses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLicenses()
  }, [])

  if (isLoading) return <Skeleton className='h-20 rounded' />

  const inputProps = {
    type: 'number',
    min: '1',
    step: '0.5',
    className: 'pl-6 w-24',
  }

  const offersExtended = watchedLicenses.length > 1

  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between'>
        <div>
          <CardTitle>License Options</CardTitle>
          <CardDescription>
            Set up licensing options for your asset
          </CardDescription>
        </div>

        <div className='flex items-center gap-2'>
          <Switch
            id='offer-extended'
            checked={offersExtended}
            onCheckedChange={() => {
              if (offersExtended) {
                remove(1)
              } else {
                append({
                  licenseId: 'EXTENDED',
                  price: watchedLicenses[0].price * MULTIPLIER,
                })
              }
            }}
          />
          <Label htmlFor='offer-extended'>Offer extended license</Label>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {fields.map((field, index) => {
          const isExtendedLicense = index > 0

          return (
            <LicenseCard
              key={field.licenseId}
              licenses={licenses}
              watchedLicenses={watchedLicenses}
              licenseType={
                isExtendedLicense ? LicenseType.EXTENDED : LicenseType.STANDARD
              }
            >
              <FormField
                control={control}
                name={`licenses.${index}.price`}
                render={({ field: { onChange, ...rest } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...rest}
                        {...inputProps}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value)
                          const price = isNaN(value) ? 0 : value
                          onChange(price)

                          if (offersExtended && !isExtendedLicense) {
                            setValue(
                              `licenses.${index + 1}.price`,
                              price * MULTIPLIER,
                            )
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </LicenseCard>
          )
        })}

        <div className='bg-muted p-4 rounded-md'>
          <h3 className='font-medium mb-2'>Licensing Tips:</h3>
          <ul className='space-y-1 text-sm'>
            <li>• Standard license is always included with your base price</li>
            <li>
              • Extended license typically costs 5-10x your standard price
            </li>
            <li>
              • Offering both licenses can increase your revenue potential
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

const LicenseCard: FC<
  PropsWithChildren & {
    watchedLicenses: Pick<LicenseOption, 'licenseId' | 'price'>[]
    licenses: License[]
    licenseType: LicenseType
  }
> = ({ children, watchedLicenses, licenses, licenseType }) => {
  const license = licenses.find((l) => l.id === licenseType)

  return (
    <div className='p-4 border rounded-md'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h3 className='font-medium'>{license?.name}</h3>
          <p className='text-sm text-muted-foreground'>
            {license?.description}
          </p>
        </div>

        <div className='relative'>
          <span className='absolute left-3 top-2 text-muted-foreground'>$</span>

          {children}

          {watchedLicenses?.[1]?.price <= watchedLicenses[0].price && (
            <p className='text-sm text-yellow-600 mt-1'>
              Extended license should be priced higher than Standard license
            </p>
          )}
        </div>
      </div>

      <div>
        <h4 className='text-sm font-medium mb-2'>Features:</h4>
        <ul className='space-y-1'>
          {license?.features.map((feature, index) => (
            <li key={index} className='text-sm flex items-start'>
              <CheckCircle className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
