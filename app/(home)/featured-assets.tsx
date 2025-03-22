'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import reviewStar from '../../public/review-star.svg'

// Mock data for featured assets
const FEATURED_ASSETS = [
  {
    id: 1,
    title: 'Advanced SEO Content Generation System',
    description:
      'A comprehensive prompt system for creating SEO-optimized content that ranks.',
    price: 79,
    category: 'Prompt Engineering',
    image: '/placeholder.svg?height=400&width=600',
    creator: {
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
      username: 'sarahjohnson',
    },
    rating: 4.9,
    reviews: 124,
  },
  {
    id: 2,
    title: 'Financial Advisor GPT',
    description:
      'Custom GPT trained to provide financial advice and investment strategies.',
    price: 99,
    category: 'Custom GPTs',
    image: '/placeholder.svg?height=400&width=600',
    creator: {
      name: 'Michael Chen',
      avatar: '/placeholder.svg?height=40&width=40',
      username: 'michaelchen',
    },
    rating: 4.8,
    reviews: 87,
  },
  {
    id: 3,
    title: 'Marketing Campaign Planner',
    description:
      'AI-powered workflow for planning and executing marketing campaigns.',
    price: 129,
    category: 'AI Workflows',
    image: '/placeholder.svg?height=400&width=600',
    creator: {
      name: 'Alex Rivera',
      avatar: '/placeholder.svg?height=40&width=40',
      username: 'alexrivera',
    },
    rating: 4.7,
    reviews: 56,
  },
]

export const FeaturedAssets = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {FEATURED_ASSETS.map((asset, index) => (
        <Link href={`/assets/${asset.id}`} key={asset.id}>
          <Card className='h-full overflow-hidden border-border/50 card-hover'>
            <CardHeader className='p-0'>
              <div className='relative aspect-[4/3] w-full overflow-hidden'>
                <Image
                  src={asset.image || '/placeholder.svg'}
                  alt={`${asset.title} - ${asset.category} by ${asset.creator.name}`}
                  fill
                  className='object-cover transition-all'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  priority={index < 2} // Only prioritize loading the first two images
                />
              </div>
            </CardHeader>

            <CardContent className='p-6'>
              <div className='flex items-center justify-between mb-3'>
                <Badge variant='secondary' className='bg-secondary/80'>
                  {asset.category}
                </Badge>
                <span className='text-lg font-bold'>${asset.price}</span>
              </div>

              <h3 className='text-xl font-semibold mb-2 line-clamp-1'>
                {asset.title}
              </h3>

              <p className='text-muted-foreground text-sm line-clamp-2 mb-4'>
                {asset.description}
              </p>

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Avatar className='h-6 w-6'>
                    <AvatarImage
                      src={asset.creator.avatar}
                      alt={asset.creator.name}
                    />
                    <AvatarFallback>
                      {asset.creator.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <span className='text-sm text-muted-foreground'>
                    {asset.creator.name}
                  </span>
                </div>

                <div className='flex items-center'>
                  <Image
                    src={reviewStar}
                    width={16}
                    height={16}
                    alt='Review star'
                    className='mr-1'
                  />

                  <span className='text-sm font-medium'>{asset.rating}</span>

                  <span className='text-xs text-muted-foreground ml-1'>
                    ({asset.reviews})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
