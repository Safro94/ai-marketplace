import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { ExploreAsset } from '@/lib/types'
import { getBasePrice } from '@/lib/utils'
import { AssetStatus } from '@prisma/client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
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
  const relatedAssets = await prisma.asset.findMany({
    where: {
      id: { not: currentAssetId },
      categoryId: categoryId,
      status: AssetStatus.PUBLISHED,
    },
    include: {
      category: true,
      assetLicenses: {
        select: {
          price: true,
        },
      },
    },
    orderBy: [{ averageRating: 'desc' }, { sales: 'desc' }],
    take: 3,
  })

  if (!relatedAssets.length) {
    // If no assets in the same category, get top-rated assets
    const topAssets = await prisma.asset.findMany({
      where: {
        id: { not: currentAssetId },
        status: AssetStatus.PUBLISHED,
      },
      include: {
        category: true,
        assetLicenses: {
          select: {
            price: true,
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

const RelatedAssetsList: FC<{ assets: Omit<ExploreAsset, 'creator'>[] }> = ({
  assets,
}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {assets.map((asset) => {
        const basePrice = getBasePrice(asset.assetLicenses)

        return (
          <Link href={ROUTES.assetsDetail(asset.id)} key={asset.id}>
            <Card className='h-full overflow-hidden border-border/50 card-hover'>
              <CardHeader className='p-0'>
                <div className='relative aspect-[4/3] w-full overflow-hidden'>
                  <Image
                    src={
                      asset.featuredImage ||
                      '/placeholder.svg?height=300&width=400'
                    }
                    alt={asset.title}
                    fill
                    className='object-cover transition-all'
                  />
                </div>
              </CardHeader>

              <CardContent className='p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <Badge
                    variant='secondary'
                    className='bg-secondary/80 text-xs'
                  >
                    {asset.category.name}
                  </Badge>

                  <span className='text-sm font-bold'>${basePrice}</span>
                </div>

                <h3 className='text-sm font-semibold mb-1 line-clamp-1'>
                  {asset.title}
                </h3>

                <div className='flex items-center text-xs'>
                  <StarIcon className='h-4 w-4 fill-yellow-400 text-yellow-400' />

                  <span className='font-medium'>
                    {asset.averageRating.toFixed(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
