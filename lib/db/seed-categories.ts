import prisma from '@/lib/prisma'

const categories = [
  {
    name: 'Prompt Engineering Systems',
    slug: 'prompt-engineering',
    description:
      'Advanced prompt frameworks and systems for optimizing AI outputs',
    iconName: 'MessageSquare',
    colorClass: 'bg-purple-500/10 text-purple-500',
  },
  {
    name: 'Custom GPTs & AI Agents',
    slug: 'custom-gpts',
    description:
      'Specialized AI assistants designed for specific tasks and industries',
    iconName: 'Bot',
    colorClass: 'bg-blue-500/10 text-blue-500',
  },
  {
    name: 'AI Workflow Automations',
    slug: 'ai-workflows',
    description: 'Ready-to-use automation templates for business processes',
    iconName: 'Workflow',
    colorClass: 'bg-green-500/10 text-green-500',
  },
  {
    name: 'Industry-Specific Solutions',
    slug: 'industry-solutions',
    description:
      'Tailored AI assets for specific industries and business needs',
    iconName: 'Briefcase',
    colorClass: 'bg-amber-500/10 text-amber-500',
  },
  {
    name: 'Content Creation Templates',
    slug: 'content-templates',
    description: 'Templates for creating various types of content efficiently',
    iconName: 'FileText',
    colorClass: 'bg-pink-500/10 text-pink-500',
  },
  {
    name: 'Data Analysis Tools',
    slug: 'data-tools',
    description: 'AI tools for analyzing and visualizing data effectively',
    iconName: 'Database',
    colorClass: 'bg-cyan-500/10 text-cyan-500',
  },
]

export async function seedCategories() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
  }
  console.log('Categories seeded successfully')
}
