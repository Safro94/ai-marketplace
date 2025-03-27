import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import prisma from '@/lib/prisma'
import {
  ArrowRight,
  Bot,
  Briefcase,
  Database,
  FileText,
  LucideIcon,
  MessageSquare,
  Workflow,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Categories | AIAssets Marketplace',
  description: 'Browse AI assets by category on AIAssets Marketplace',
  alternates: {
    canonical: '/categories',
  },
}

const iconMap: Record<string, LucideIcon> = {
  MessageSquare: MessageSquare,
  Bot: Bot,
  Workflow: Workflow,
  Briefcase: Briefcase,
  FileText: FileText,
  Database: Database,
}

export default async function CategoriesPage() {
  // Fetch categories from the database
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  // Count assets in each category and get featured assets
  const categoriesWithData = await Promise.all(
    categories.map(async (category) => {
      // Count assets in this category
      const count = await prisma.asset.count({
        where: {
          categoryId: category.id,
          status: 'PUBLISHED',
        },
      })

      // Get top 3 assets in this category
      const featuredAssets = await prisma.asset.findMany({
        where: {
          categoryId: category.id,
          status: 'PUBLISHED',
        },
        orderBy: [{ averageRating: 'desc' }, { sales: 'desc' }],
        select: {
          title: true,
        },
        take: 3,
      })

      return {
        ...category,
        count,
        featured: featuredAssets.map((asset) => asset.title),
      }
    }),
  )

  return (
    <div className='container py-12'>
      <div className='text-center mb-12'>
        <h1 className='text-3xl font-bold tracking-tight mb-2'>
          Browse by Category
        </h1>
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          Explore our curated categories of AI assets designed for specific use
          cases and industries
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {categoriesWithData.map((category) => {
          // Get the icon component or default to MessageSquare
          const IconComponent =
            category.iconName && iconMap[category.iconName]
              ? iconMap[category.iconName]
              : MessageSquare

          return (
            <Card
              key={category.id}
              className='border-border/50 overflow-hidden'
            >
              <CardHeader className='pb-2'>
                <div className='flex items-start'>
                  <div
                    className={`p-3 rounded-lg ${category.colorClass || 'bg-primary/10 text-primary'} mr-4`}
                  >
                    <IconComponent className='h-6 w-6' />
                  </div>
                  <div>
                    <CardTitle className='text-xl'>{category.name}</CardTitle>
                    <CardDescription className='mt-1'>
                      {category.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className='mt-2'>
                  <p className='text-sm font-medium mb-2'>
                    {category.count} assets
                  </p>

                  <div className='space-y-1 mb-4'>
                    {category.featured.map((item, index) => (
                      <p
                        key={index}
                        className='text-sm text-muted-foreground flex items-center'
                      >
                        <span className='h-1 w-1 rounded-full bg-muted-foreground mr-2'></span>
                        {item}
                      </p>
                    ))}
                  </div>

                  <Button variant='outline' className='w-full' asChild>
                    <Link href={`${ROUTES.categories()}/${category.slug}`}>
                      Browse {category.name}
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
