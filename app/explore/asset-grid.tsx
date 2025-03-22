'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import reviewStar from '../../public/review-star.svg'

// Mock data for assets
const assets = [
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
    useCase: 'Content Creation',
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
    useCase: 'Financial',
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
    useCase: 'Marketing',
  },
  {
    id: 4,
    title: 'Legal Document Analyzer',
    description:
      'AI system that analyzes legal documents and extracts key information.',
    price: 149,
    category: 'Industry Solutions',
    image: '/placeholder.svg?height=400&width=600',
    creator: {
      name: 'Jessica Kim',
      avatar: '/placeholder.svg?height=40&width=40',
      username: 'jessicakim',
    },
    rating: 4.6,
    reviews: 42,
    useCase: 'Legal',
  },
  {
    id: 5,
    title: 'Social Media Content Calendar',
    description:
      'Complete system for planning and generating social media content.',
    price: 69,
    category: 'Content Templates',
    image: '/placeholder.svg?height=400&width=600',
    creator: {
      name: 'David Wilson',
      avatar: '/placeholder.svg?height=40&width=40',
      username: 'davidwilson',
    },
    rating: 4.5,
    reviews: 78,
    useCase: 'Content Creation',
  },
  {
    id: 6,
    title: 'Data Visualization Prompt System',
    description:
      'Generate compelling data visualizations with specialized AI prompts.',
    price: 89,
    category: 'Data Tools',
    image: '/placeholder.svg?height=400&width=600',
    creator: {
      name: 'Emma Thompson',
      avatar: '/placeholder.svg?height=40&width=40',
      username: 'emmathompson',
    },
    rating: 4.4,
    reviews: 63,
    useCase: 'Data Analysis',
  },
]

export const AssetGrid = () => {
  const [sortOption, setSortOption] = useState('featured')

  // Sort assets based on selected option
  const sortedAssets = [...assets].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return b.id - a.id
      default:
        return 0 // featured - keep original order
    }
  })

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <p className='text-sm text-muted-foreground'>
          Showing{' '}
          <span className='font-medium text-foreground'>{assets.length}</span>{' '}
          results
        </p>

        <div className='flex items-center space-x-2'>
          <p className='text-sm text-muted-foreground mr-2'>Sort by:</p>

          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value='featured'>Featured</SelectItem>
              <SelectItem value='price-low'>Price: Low to High</SelectItem>
              <SelectItem value='price-high'>Price: High to Low</SelectItem>
              <SelectItem value='rating'>Highest Rated</SelectItem>
              <SelectItem value='newest'>Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {sortedAssets.map((asset) => (
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
    </div>
  )
}
