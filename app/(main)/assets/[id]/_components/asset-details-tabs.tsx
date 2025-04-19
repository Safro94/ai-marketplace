import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Prisma } from '@prisma/client'
import { CheckCircle, InfoIcon } from 'lucide-react'
import { FC } from 'react'
import { AssetReviews } from './asset-reviews'

enum TabsEnum {
  DESCRIPTION = 'description',
  FEATURES = 'features',
  REVIEWS = 'reviews',
}

interface Props
  extends Prisma.AssetGetPayload<{
    select: {
      id: true
      description: true
      features: true
      requirements: true
      reviews: {
        include: {
          userProfile: {
            include: {
              user: {
                select: {
                  name: true
                  image: true
                }
              }
            }
          }
        }
      }
    }
  }> {
  isPurchased: boolean
}

export const AssetDetailsTabs: FC<Props> = ({
  id,
  description,
  features,
  requirements,
  reviews,
  isPurchased,
}) => {
  return (
    <Tabs defaultValue={TabsEnum.DESCRIPTION}>
      <TabsList className='grid grid-cols-3'>
        <TabsTrigger value={TabsEnum.DESCRIPTION}>Description</TabsTrigger>
        <TabsTrigger value={TabsEnum.FEATURES}>Features</TabsTrigger>
        <TabsTrigger value={TabsEnum.REVIEWS}>Reviews</TabsTrigger>
      </TabsList>

      <TabsContent value={TabsEnum.DESCRIPTION} className='pt-6'>
        <p className='prose prose-invert max-w-none break-anywhere'>
          {description}
        </p>
      </TabsContent>

      <TabsContent value={TabsEnum.FEATURES} className='pt-6'>
        <div className='space-y-6'>
          <div>
            <h3 className='text-xl font-semibold mb-3'>Features</h3>

            <ul className='space-y-2'>
              {features.map((feature) => (
                <li key={feature} className='flex items-center'>
                  <CheckCircle className='w-5 h-5 text-primary mr-2 flex-shrink-0' />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-xl font-semibold mb-3'>Requirements</h3>

            <ul className='space-y-2'>
              {requirements.map((requirement: string, index: number) => (
                <li key={index} className='flex items-center'>
                  <InfoIcon className='w-5 h-5 text-primary mr-2 flex-shrink-0' />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </TabsContent>

      <TabsContent value={TabsEnum.REVIEWS} className='pt-6'>
        <AssetReviews
          assetId={id}
          reviews={reviews}
          isPurchased={isPurchased}
        />
      </TabsContent>
    </Tabs>
  )
}
