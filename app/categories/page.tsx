import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowRight,
  Bot,
  Briefcase,
  Database,
  FileText,
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

const CATEGORIES = [
  {
    id: 'prompt-engineering',
    name: 'Prompt Engineering Systems',
    description:
      'Advanced prompt frameworks and systems for optimizing AI outputs',
    icon: MessageSquare,
    color: 'bg-purple-500/10 text-purple-500',
    count: 124,
    featured: [
      'SEO Content Generation System',
      'Storytelling Framework',
      'Technical Documentation Generator',
    ],
  },
  {
    id: 'custom-gpts',
    name: 'Custom GPTs & AI Agents',
    description:
      'Specialized AI assistants designed for specific tasks and industries',
    icon: Bot,
    color: 'bg-blue-500/10 text-blue-500',
    count: 87,
    featured: [
      'Financial Advisor GPT',
      'Legal Document Analyzer',
      'Healthcare Assistant',
    ],
  },
  {
    id: 'ai-workflows',
    name: 'AI Workflow Automations',
    description: 'Ready-to-use automation templates for business processes',
    icon: Workflow,
    color: 'bg-green-500/10 text-green-500',
    count: 56,
    featured: [
      'Marketing Campaign Planner',
      'Customer Support Workflow',
      'Content Calendar Automation',
    ],
  },
  {
    id: 'industry-solutions',
    name: 'Industry-Specific Solutions',
    description:
      'Tailored AI assets for specific industries and business needs',
    icon: Briefcase,
    color: 'bg-amber-500/10 text-amber-500',
    count: 42,
    featured: [
      'Real Estate Listing Generator',
      'E-commerce Product Description System',
      'Healthcare Documentation Assistant',
    ],
  },
  {
    id: 'content-templates',
    name: 'Content Creation Templates',
    description: 'Templates for creating various types of content efficiently',
    icon: FileText,
    color: 'bg-pink-500/10 text-pink-500',
    count: 98,
    featured: [
      'Social Media Content Calendar',
      'Email Marketing Templates',
      'Blog Post Framework',
    ],
  },
  {
    id: 'data-tools',
    name: 'Data Analysis Tools',
    description: 'AI tools for analyzing and visualizing data effectively',
    icon: Database,
    color: 'bg-cyan-500/10 text-cyan-500',
    count: 35,
    featured: [
      'Data Visualization Prompt System',
      'Market Research Analyzer',
      'Business Intelligence Assistant',
    ],
  },
]

export default function CategoriesPage() {
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
        {CATEGORIES.map((category) => (
          <Card key={category.id} className='border-border/50 overflow-hidden'>
            <CardHeader className='pb-2'>
              <div className='flex items-start'>
                <div className={`p-3 rounded-lg ${category.color} mr-4`}>
                  <category.icon className='h-6 w-6' />
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
                  <Link href={`/categories/${category.id}`}>
                    Browse {category.name}
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
