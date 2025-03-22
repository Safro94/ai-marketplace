'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import reviewStar from '../../../public/review-star.svg'

interface Props {
  currentAssetId: number
}
// Mock data for related assets
const RELATED_ASSETS = [
  {
    id: 101,
    title: 'Content Calendar Generator',
    description:
      'AI system for planning and scheduling content across multiple platforms.',
    price: 59,
    category: 'Content Templates',
    image: '/placeholder.svg?height=300&width=400',
    rating: 4.7,
  },
  {
    id: 102,
    title: 'Keyword Research Framework',
    description:
      'Advanced prompts for discovering high-value keywords and search intent.',
    price: 49,
    category: 'Prompt Engineering',
    image: '/placeholder.svg?height=300&width=400',
    rating: 4.8,
  },
  {
    id: 103,
    title: 'Blog Post Optimizer',
    description:
      'AI system that enhances existing content for better SEO performance.',
    price: 69,
    category: 'AI Workflows',
    image: '/placeholder.svg?height=300&width=400',
    rating: 4.6,
  },
]

export const RelatedAssets: FC<Props> = ({ currentAssetId }) => {
  // Filter out the current asset if it's in the related assets
  const filteredAssets = RELATED_ASSETS.filter(
    (asset) => asset.id !== currentAssetId,
  )

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {filteredAssets.map((asset) => (
        <Link href={`/assets/${asset.id}`} key={asset.id}>
          <Card className='h-full overflow-hidden border-border/50 card-hover'>
            <CardHeader className='p-0'>
              <div className='relative aspect-[4/3] w-full overflow-hidden'>
                <Image
                  src={asset.image || '/placeholder.svg'}
                  alt={asset.title}
                  fill
                  className='object-cover transition-all'
                />
              </div>
            </CardHeader>

            <CardContent className='p-4'>
              <div className='flex items-center justify-between mb-2'>
                <Badge variant='secondary' className='bg-secondary/80 text-xs'>
                  {asset.category}
                </Badge>
                <span className='text-sm font-bold'>${asset.price}</span>
              </div>

              <h3 className='text-sm font-semibold mb-1 line-clamp-1'>
                {asset.title}
              </h3>

              <div className='flex items-center text-xs'>
                <Image
                  src={reviewStar}
                  width={16}
                  height={16}
                  alt='Review star'
                  className='mr-1'
                />
                <span className='font-medium'>{asset.rating}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
