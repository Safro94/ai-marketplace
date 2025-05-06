import { AssetsGrid } from '@/components/assets-grid'
import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
  HomeSectionTitleContainer,
} from '@/components/page-container'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getPaginatedAssets } from '@/data-access/assets'
import { ROUTES } from '@/lib/constants'
import { AssetStatus } from '@prisma/client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const FeaturedSection = async () => {
  const [featuredAssets] = await getPaginatedAssets({
    where: {
      status: AssetStatus.PUBLISHED,
      featured: true,
    },
    orderBy: [{ featuredOrder: 'asc' }, { createdAt: 'desc' }],
    limit: 4,
    skip: 0,
  })

  if (!featuredAssets.length) return null

  return (
    <HomeSection>
      <HomeSectionTitleContainer>
        <HomeSectionTitle className='text-primary'>
          Featured Products
        </HomeSectionTitle>

        <HomeSectionDescription>
          Discover our most popular digital products created by talented
          creators
        </HomeSectionDescription>
      </HomeSectionTitleContainer>

      <div className='grid items-center'>
        <div className='grid gap-4 mb-4'>
          <ScrollArea className='py-4'>
            <AssetsGrid items={featuredAssets} />
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>

        <div className='flex justify-center'>
          <Button asChild>
            <Link href={ROUTES.explore()}>
              View all assets
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </HomeSection>
  )
}
