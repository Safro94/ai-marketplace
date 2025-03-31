import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LICENSE_TYPE } from '@/lib/constants'
import { License } from '@prisma/client'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Dispatch, FC, SetStateAction } from 'react'

interface Props {
  licenses: License[]
  assetLicenses: { [key: string]: { enabled: boolean; price: number } }
  setAssetLicenses: Dispatch<
    SetStateAction<{
      [key: string]: {
        enabled: boolean
        price: number
      }
    }>
  >
}

export const AssetLicenseSection: FC<Props> = ({
  licenses,
  assetLicenses,
  setAssetLicenses,
}) => {
  return (
    <Card className='mt-8'>
      <CardHeader>
        <CardTitle>Licensing Options</CardTitle>

        <CardDescription>
          Set up licensing options and pricing for your asset
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue='options' className='w-full'>
          <TabsList className='mb-4'>
            <TabsTrigger value='options'>License Options</TabsTrigger>
            <TabsTrigger value='preview'>Preview</TabsTrigger>
          </TabsList>

          <TabsContent value='options' className='space-y-6'>
            {licenses.map((license) => (
              <div
                key={license.id}
                className='flex flex-col space-y-4 p-4 border rounded-md'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-medium'>{license.name}</h3>
                    <p className='text-sm text-muted-foreground'>
                      {license.description}
                    </p>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Switch
                      id={`enable-${license.id}`}
                      checked={assetLicenses[license.id]?.enabled || false}
                      onCheckedChange={(checked) => {
                        setAssetLicenses((prev) => ({
                          ...prev,
                          [license.id]: {
                            ...prev[license.id],
                            enabled: checked,
                          },
                        }))
                      }}
                    />
                    <Label htmlFor={`enable-${license.id}`}>Enable</Label>
                  </div>
                </div>

                {assetLicenses[license.id]?.enabled && (
                  <div className='pt-2'>
                    <Label htmlFor={`price-${license.id}`}>Price ($)</Label>

                    <div className='relative mt-1'>
                      <span className='absolute left-3 top-2.5 text-muted-foreground'>
                        $
                      </span>

                      <Input
                        id={`price-${license.id}`}
                        type='number'
                        min='0'
                        step='0.01'
                        className='pl-7'
                        value={assetLicenses[license.id]?.price || 0}
                        onChange={(e) => {
                          const price = Number.parseFloat(e.target.value)
                          setAssetLicenses((prev) => ({
                            ...prev,
                            [license.id]: {
                              ...prev[license.id],
                              price: isNaN(price) ? 0 : price,
                            },
                          }))
                        }}
                      />
                    </div>

                    {license.id === LICENSE_TYPE.EXTENDED &&
                      assetLicenses[LICENSE_TYPE.STANDARD]?.enabled &&
                      assetLicenses[license.id]?.price <=
                        assetLicenses[LICENSE_TYPE.STANDARD]?.price && (
                        <p className='text-sm text-yellow-600 mt-1'>
                          Extended license should be priced higher than Standard
                          license
                        </p>
                      )}

                    {license.id === LICENSE_TYPE.EXTENDED &&
                      assetLicenses[LICENSE_TYPE.EXTENDED]?.enabled &&
                      assetLicenses[license.id]?.price <=
                        assetLicenses[LICENSE_TYPE.EXTENDED]?.price && (
                        <p className='text-sm text-yellow-600 mt-1'>
                          Enterprise license should be priced higher than
                          Extended license
                        </p>
                      )}
                  </div>
                )}

                <div className='pt-2'>
                  <h4 className='text-sm font-medium mb-2'>Features:</h4>
                  <ul className='space-y-1'>
                    {license.features.map((feature, index) => (
                      <li key={index} className='text-sm flex items-start'>
                        <CheckCircle className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <div className='bg-muted p-4 rounded-md'>
              <h3 className='font-medium mb-2'>Licensing Tips:</h3>
              <ul className='space-y-1 text-sm'>
                <li>• Standard licenses typically cost 1x your base price</li>
                <li>
                  • Extended licenses typically cost 5-10x your standard price
                </li>
                <li>
                  • Enterprise licenses typically cost 20x+ your standard price
                </li>
                <li>• Enable at least one license type for your asset</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value='preview'>
            <div className='space-y-6'>
              <h3 className='font-medium'>License Preview</h3>
              <p className='text-sm text-muted-foreground'>
                This is how your licensing options will appear to buyers:
              </p>

              <div className='grid  md:grid-cols-3 gap-4'>
                {licenses
                  .filter((license) => assetLicenses[license.id]?.enabled)
                  .map((license) => (
                    <Card
                      key={license.id}
                      className={
                        license.id === LICENSE_TYPE.EXTENDED
                          ? 'border-primary'
                          : ''
                      }
                    >
                      {license.id === LICENSE_TYPE.EXTENDED && (
                        <div className='bg-primary text-primary-foreground text-center py-1 text-sm font-medium'>
                          RECOMMENDED
                        </div>
                      )}

                      <CardHeader>
                        <CardTitle>{license.name}</CardTitle>
                        <CardDescription>{license.description}</CardDescription>

                        <div className='mt-2 text-2xl font-bold'>
                          ${assetLicenses[license.id]?.price.toFixed(2)}
                        </div>
                      </CardHeader>

                      <CardContent>
                        <ul className='space-y-2'>
                          {license.features.map((feature, index) => (
                            <li
                              key={index}
                              className='text-sm flex items-start'
                            >
                              <CheckCircle className='h-4 w-4 text-green-500 mr-2 mt-0.5' />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>

                      <CardFooter>
                        <Button className='w-full' variant='outline'>
                          Select {license.name}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>

              {!Object.values(assetLicenses).filter((l) => l.enabled)
                .length && (
                <div className='text-center p-8 border rounded-md'>
                  <AlertCircle className='h-8 w-8 text-yellow-500 mx-auto mb-2' />

                  <h3 className='font-medium'>No licenses enabled</h3>

                  <p className='text-sm text-muted-foreground mt-1'>
                    Please enable at least one license type for your asset
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
