import { Asset } from '@/components/asset'
import { getAssets } from '@/data-access/assets'
import { ExploreAsset } from '@/lib/types'
import { AssetStatus } from '@prisma/client'
import { FC } from 'react'

interface Props {
  currentAssetId: string
  categoryId: string
}

export const RelatedAssets: FC<Props> = async ({
  currentAssetId,
  categoryId,
}) => {
  // Fetch related assets from the same category
  const relatedAssets = await getAssets({
    where: {
      id: { not: currentAssetId },
      categoryId: categoryId,
      status: AssetStatus.PUBLISHED,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      creator: {
        select: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: [{ averageRating: 'desc' }, { sales: 'desc' }],
    take: 3,
  })

  if (!relatedAssets.length) {
    // If no assets in the same category, get top-rated assets
    const topAssets = await getAssets({
      where: {
        id: { not: currentAssetId },
        status: AssetStatus.PUBLISHED,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        creator: {
          select: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: [{ averageRating: 'desc' }, { sales: 'desc' }],
      take: 3,
    })

    return <RelatedAssetsList assets={topAssets} />
  }

  return <RelatedAssetsList assets={relatedAssets} />
}

const RelatedAssetsList: FC<{ assets: ExploreAsset[] }> = ({ assets }) => {
  return (
    <div className='grid  md:grid-cols-3 gap-6'>
      {assets.map((asset) => {
        return <Asset key={asset.id} {...asset} />
      })}
    </div>
  )
}
