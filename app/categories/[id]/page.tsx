import { AssetFilters } from '@/app/explore/asset-filters'
import { AssetGrid } from '@/app/explore/asset-grid'
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
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

const iconMap: Record<string, LucideIcon> = {
  MessageSquare: MessageSquare,
  Bot: Bot,
  Workflow: Workflow,
  Briefcase: Briefcase,
  FileText: FileText,
  Database: Database,
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.id },
  })

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found',
    }
  }

  return {
    title: `${category.name} | AIAssets Marketplace`,
    description:
      category.description ||
      `Browse ${category.name} assets on AIAssets Marketplace`,
    alternates: {
      canonical: `/categories/${params.id}`,
    },
  }
}

export default async function Category({ params }: Props) {
  const category = await prisma.category.findUnique({
    where: { slug: params.id },
  })

  if (!category) {
    notFound()
  }

  // Get the icon component or default to MessageSquare
  const IconComponent =
    category.iconName && iconMap[category.iconName]
      ? iconMap[category.iconName]
      : MessageSquare

  return (
    <div className='container py-8'>
      <div className='flex items-center mb-6'>
        <div
          className={`p-3 rounded-lg ${category.colorClass || 'bg-primary/10 text-primary'} mr-4`}
        >
          <IconComponent className='h-6 w-6' />
        </div>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{category.name}</h1>
          <p className='text-muted-foreground'>{category.description}</p>
        </div>
      </div>

      <div className='flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6'>
        <aside className='w-full md:w-64 lg:w-72 shrink-0'>
          <AssetFilters initialCategory={category.id} />
        </aside>

        <main className='flex-1'>
          <AssetGrid initialCategory={category.id} />
        </main>
      </div>
    </div>
  )
}
