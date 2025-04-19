import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Motion } from '@/components/ui/motion'
import { getCategoriesWithCount } from '@/data-access/categories'
import { FADE_IN_UP, ROUTES } from '@/lib/constants'
import { EXPLORE_PARAMS } from '@/lib/types'
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
  const categories = await getCategoriesWithCount()

  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {categories.map((category, i) => {
        // Get the icon component or default to MessageSquare
        const IconComponent =
          category.iconName && iconMap[category.iconName]
            ? iconMap[category.iconName]
            : MessageSquare

        return (
          <Motion
            key={category.id}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, margin: '-100px' }}
            variants={FADE_IN_UP(0.5 * i)}
          >
            <Link
              href={`${ROUTES.explore()}?${[EXPLORE_PARAMS.CATEGORY]}=${category.slug}`}
            >
              <Card className='h-full transition-colors card-hover'>
                <CardHeader>
                  <div
                    className={`rounded-lg ${category.colorClass || 'bg-primary/10 text-primary'}`}
                  >
                    <IconComponent className='h-10 w-10' />
                  </div>
                </CardHeader>

                <CardContent className='flex items-start space-x-4'>
                  <div className='space-y-1'>
                    <h3 className='font-medium text-lg'>{category.name}</h3>
                    <p className='text-sm text-muted-foreground'>
                      {category.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </Motion>
        )
      })}
    </div>
  )
}
