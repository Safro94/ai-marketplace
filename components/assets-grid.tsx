import { Prisma } from '@prisma/client'
import { FC } from 'react'
import { Asset } from './asset'

interface Props {
  items:
    | Prisma.AssetGetPayload<{
        select: {
          id: true
          featuredImage: true
          totalReviews: true
          title: true
          description: true
          averageRating: true
          basePrice: true
          category: {
            select: {
              name: true
            }
          }
          creator: {
            select: {
              user: {
                select: {
                  name: true
                  image: true
                }
              }
            }
          }
        }
      }>[]
    | undefined
}

export const AssetsGrid: FC<Props> = ({ items }) => {
  return (
    <div className='py-4 grid grid-cols-[repeat(auto-fill, minmax(0,1fr))] md:grid-cols-[repeat(auto-fill,minmax(325px,1fr))] gap-2'>
      {items?.map((asset) => (
        <Asset
          key={asset.id}
          id={asset.id}
          title={asset.title}
          description={asset.description}
          averageRating={asset.averageRating}
          basePrice={asset.basePrice}
          category={asset.category}
          creator={asset.creator}
          featuredImage={asset.featuredImage}
          totalReviews={asset.totalReviews}
        />
      ))}
    </div>
  )
}
