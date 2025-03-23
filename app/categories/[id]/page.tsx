import { AssetFilters } from '@/app/explore/asset-filters'
import { AssetGrid } from '@/app/explore/asset-grid'
import {
  Bot,
  Briefcase,
  Database,
  FileText,
  MessageSquare,
  Workflow,
} from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: { id: string }
}

const categories = {
  'prompt-engineering': {
    name: 'Prompt Engineering Systems',
    description:
      'Advanced prompt frameworks and systems for optimizing AI outputs',
    icon: MessageSquare,
    color: 'bg-purple-500/10 text-purple-500',
  },
  'custom-gpts': {
    name: 'Custom GPTs & AI Agents',
    description:
      'Specialized AI assistants designed for specific tasks and industries',
    icon: Bot,
    color: 'bg-blue-500/10 text-blue-500',
  },
  'ai-workflows': {
    name: 'AI Workflow Automations',
    description: 'Ready-to-use automation templates for business processes',
    icon: Workflow,
    color: 'bg-green-500/10 text-green-500',
  },
  'industry-solutions': {
    name: 'Industry-Specific Solutions',
    description:
      'Tailored AI assets for specific industries and business needs',
    icon: Briefcase,
    color: 'bg-amber-500/10 text-amber-500',
  },
  'content-templates': {
    name: 'Content Creation Templates',
    description: 'Templates for creating various types of content efficiently',
    icon: FileText,
    color: 'bg-pink-500/10 text-pink-500',
  },
  'data-tools': {
    name: 'Data Analysis Tools',
    description: 'AI tools for analyzing and visualizing data effectively',
    icon: Database,
    color: 'bg-cyan-500/10 text-cyan-500',
  },
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = categories[params.id as keyof typeof categories]

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found',
    }
  }

  return {
    title: `${category.name} | AIAssets Marketplace`,
    description: category.description,
    alternates: {
      canonical: `/categories/${params.id}`,
    },
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories[params.id as keyof typeof categories]

  if (!category) {
    notFound()
  }

  const CategoryIcon = category.icon

  return (
    <div className='container py-8'>
      <div className='flex items-center mb-6'>
        <div className={`p-3 rounded-lg ${category.color} mr-4`}>
          <CategoryIcon className='h-6 w-6' />
        </div>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{category.name}</h1>
          <p className='text-muted-foreground'>{category.description}</p>
        </div>
      </div>

      <div className='flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6'>
        <aside className='w-full md:w-64 lg:w-72 shrink-0'>
          <AssetFilters />
        </aside>
        <main className='flex-1'>
          <AssetGrid />
        </main>
      </div>
    </div>
  )
}
