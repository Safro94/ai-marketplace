import { AssetsGrid } from '@/components/assets-grid'
import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
} from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getAssets } from '@/data-access/assets'
import { ROUTES } from '@/lib/constants'
import { AssetStatus } from '@prisma/client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const FeaturedSection = async () => {
  const featuredAssets = await getAssets({
    where: {
      status: AssetStatus.PUBLISHED,
      featured: true,
    },
    include: {
      category: true,
      creator: {
        include: {
          user: true,
        },
      },
    },
    orderBy: [{ featuredOrder: 'asc' }, { createdAt: 'desc' }],
    take: 4,
  })

  if (!featuredAssets.length) return null

  return (
    <HomeSection className='bg-muted'>
      <div className='grid gap-1 mb-8'>
        <HomeSectionTitle className='text-center'>
          Featured Assets
        </HomeSectionTitle>

        <HomeSectionDescription>
          Handpicked premium assets from our marketplace
        </HomeSectionDescription>
      </div>

      <div className='grid items-center '>
        <div className='grid gap-4'>
          <ScrollArea className='py-4'>
            <AssetsGrid items={featuredAssets} />
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>

        <div className='flex justify-center'>
          <Button asChild>
            <Link href={ROUTES.explore()} prefetch>
              View all assets
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </HomeSection>
  )
}
