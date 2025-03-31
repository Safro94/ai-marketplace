'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { API_ROUTES, LICENSE_TYPE } from '@/lib/constants'
import { CheckCircle } from 'lucide-react'
import { FC, useEffect, useState } from 'react'

type License = {
  id: string
  name: string
  description: string
  features: string[]
  isDefault: boolean
}

interface Props {
  basePrice: number
  onChange: (licenses: { licenseId: string; price: number }[]) => void
}

export const LicensePricing: FC<Props> = ({ basePrice, onChange }) => {
  const [licenses, setLicenses] = useState<License[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [offerExtended, setOfferExtended] = useState(false)
  const [standardPrice, setStandardPrice] = useState(basePrice)
  const [extendedPrice, setExtendedPrice] = useState(basePrice * 5)

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

  useEffect(() => {
    setStandardPrice(basePrice)
    setExtendedPrice(basePrice * 5)
  }, [basePrice])

  useEffect(() => {
    // Notify parent component of license changes
    const enabledLicenses = [
      { licenseId: LICENSE_TYPE.STANDARD, price: standardPrice },
    ]

    if (offerExtended) {
      enabledLicenses.push({
        licenseId: LICENSE_TYPE.EXTENDED,
        price: extendedPrice,
      })
    }

    onChange(enabledLicenses)
  }, [standardPrice, extendedPrice, offerExtended, onChange])

  if (isLoading) return <Skeleton className='h-20 rounded' />

  const standardLicense = licenses.find((l) => l.id === LICENSE_TYPE.STANDARD)
  const extendedLicense = licenses.find((l) => l.id === LICENSE_TYPE.EXTENDED)

  if (!standardLicense || !extendedLicense) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>License Options</CardTitle>
        <CardDescription>
          Set up licensing options for your asset
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Standard License (always enabled) */}
        <div className='p-4 border rounded-md'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h3 className='font-medium'>{standardLicense.name}</h3>
              <p className='text-sm text-muted-foreground'>
                {standardLicense.description}
              </p>
            </div>

            <div className='relative'>
              <span className='absolute left-3 top-2 text-muted-foreground'>
                $
              </span>

              <Input
                type='number'
                min='1'
                step='0.5'
                prefix='$'
                className='pl-6 w-24'
                value={standardPrice.toFixed(2)}
                onChange={(e) => {
                  const price = parseFloat(e.target.value)
                  setStandardPrice(isNaN(price) ? 0 : price)
                }}
              />
            </div>
          </div>

          <div>
            <h4 className='text-sm font-medium mb-2'>Features:</h4>
            <ul className='space-y-1'>
              {standardLicense.features.map((feature, index) => (
                <li key={index} className='text-sm flex items-start'>
                  <CheckCircle className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Extended License (optional) */}
        <div className='p-4 border rounded-md'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h3 className='font-medium'>{extendedLicense.name}</h3>
              <p className='text-sm text-muted-foreground'>
                {extendedLicense.description}
              </p>
            </div>

            <div className='flex items-center space-x-2'>
              <Switch
                id='offer-extended'
                checked={offerExtended}
                onCheckedChange={setOfferExtended}
              />
              <Label htmlFor='offer-extended'>Offer</Label>
            </div>
          </div>

          {offerExtended && (
            <div className='mb-4'>
              <Label htmlFor='extended-price'>Price ($)</Label>
              <div className='relative mt-1'>
                <span className='absolute left-3 top-2 text-muted-foreground'>
                  $
                </span>

                <Input
                  id='extended-price'
                  type='number'
                  min='0'
                  step='0.5'
                  className='pl-6'
                  value={extendedPrice.toFixed(2)}
                  onChange={(e) => {
                    const price = parseFloat(e.target.value)
                    setExtendedPrice(isNaN(price) ? 0 : price)
                  }}
                />
              </div>

              {extendedPrice <= standardPrice && (
                <p className='text-sm text-yellow-600 mt-1'>
                  Extended license should be priced higher than Standard license
                </p>
              )}
            </div>
          )}

          <div>
            <h4 className='text-sm font-medium mb-2'>Features:</h4>
            <ul className='space-y-1'>
              {extendedLicense.features.map((feature, index) => (
                <li key={index} className='text-sm flex items-start'>
                  <CheckCircle className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

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
