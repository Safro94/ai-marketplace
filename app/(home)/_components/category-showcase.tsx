import { Card, CardContent } from '@/components/ui/card'
import { EXPLORE_PARAMS, ROUTES } from '@/lib/constants'
import prisma from '@/lib/prisma'
import {
  Bot,
  Briefcase,
  Database,
  FileText,
  LucideIcon,
  MessageSquare,
  Workflow,
} from 'lucide-react'
import Link from 'next/link'

const iconMap: Record<string, LucideIcon> = {
  MessageSquare: MessageSquare,
  Bot: Bot,
  Workflow: Workflow,
  Briefcase: Briefcase,
  FileText: FileText,
  Database: Database,
}

export const CategoryShowcase = async () => {
  // Fetch categories from the database
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  // Count assets in each category
  const categoryCounts = await Promise.all(
    categories.map(async (category) => {
      const count = await prisma.asset.count({
        where: {
          categoryId: category.id,
          status: 'PUBLISHED',
        },
      })
      return { ...category, count }
    }),
  )

  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {categoryCounts.map((category) => {
        // Get the icon component or default to MessageSquare
        const IconComponent =
          category.iconName && iconMap[category.iconName]
            ? iconMap[category.iconName]
            : MessageSquare

        return (
          <Link
            href={`${ROUTES.explore()}?${[EXPLORE_PARAMS.CATEGORY]}=${category.slug}`}
            key={category.id}
          >
            <Card className='h-full transition-colors card-hover'>
              <CardContent className='p-6 flex items-start space-x-4'>
                <div
                  className={`p-3 rounded-lg ${category.colorClass || 'bg-primary/10 text-primary'}`}
                >
                  <IconComponent className='h-6 w-6' />
                </div>

                <div className='space-y-1'>
                  <h3 className='font-medium text-lg'>{category.name}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {category.description}
                  </p>

                  <p className='text-sm font-medium'>{category.count} assets</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
