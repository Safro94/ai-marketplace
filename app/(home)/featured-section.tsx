import { Asset } from '@/components/asset'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import prisma from '@/lib/prisma'
import { AssetStatus } from '@prisma/client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const FeaturedSection = async () => {
  const featuredAssets = await prisma.asset.findMany({
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
    <section className='py-16 bg-secondary/30'>
      <div className='container'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Featured Assets
            </h2>

            <p className='text-muted-foreground mt-1'>
              Handpicked premium assets from our marketplace
            </p>
          </div>

          <Button variant='ghost' className='mt-4 md:mt-0' asChild>
            <Link href={ROUTES.explore()}>
              View all assets
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {featuredAssets.map((asset) => (
            <Asset key={asset.id} {...asset} />
          ))}
        </div>
      </div>
    </section>
  )
}
