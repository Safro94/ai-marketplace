import prisma from '@/lib/prisma'

const CATEGORIES = [
  {
    name: 'Prompt Engineering Systems',
    slug: 'prompt-engineering',
    description:
      'Advanced prompt frameworks and systems for optimizing AI outputs',
    iconName: 'MessageSquare',
    colorClass: 'text-purple-500',
  },
  {
    name: 'Custom GPTs & AI Agents',
    slug: 'custom-gpts',
    description:
      'Specialized AI assistants designed for specific tasks and industries',
    iconName: 'Bot',
    colorClass: 'text-blue-500',
  },
  {
    name: 'AI Workflow Automations',
    slug: 'ai-workflows',
    description: 'Ready-to-use automation templates for business processes',
    iconName: 'Workflow',
    colorClass: 'text-green-500',
  },
  {
    name: 'Industry-Specific Solutions',
    slug: 'industry-solutions',
    description:
      'Tailored AI assets for specific industries and business needs',
    iconName: 'Briefcase',
    colorClass: 'text-amber-500',
  },
  {
    name: 'Content Creation Templates',
    slug: 'content-templates',
    description: 'Templates for creating various types of content efficiently',
    iconName: 'FileText',
    colorClass: 'text-pink-500',
  },
  {
    name: 'Data Analysis Tools',
    slug: 'data-tools',
    description: 'AI tools for analyzing and visualizing data effectively',
    iconName: 'Database',
    colorClass: 'text-cyan-500',
  },
  {
    name: 'AI Image Generation',
    slug: 'ai-images',
    description:
      'Tools and prompts for creating and editing AI-generated images',
    iconName: 'Image',
    colorClass: 'text-red-500',
  },
  {
    name: 'AI Artwork',
    slug: 'ai-artwork',
    description: 'Upload and showcase your AI-generated artwork and designs',
    iconName: 'Upload',
    colorClass: 'text-fuschia-500',
  },
]

export async function seedCategories() {
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
  }
  console.log('Categories seeded successfully')
}
