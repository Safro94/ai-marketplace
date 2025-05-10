'use client'

import { Button } from '@/components/ui/button'
import { EXPLORE_PARAMS } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Category } from '@prisma/client'
import * as LucideIcons from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useState } from 'react'

interface Props {
  initialCategories?: string[]
  categories: Category[] &
    {
      count: number
    }[]
}

export const ExploreCategoriesSelector: FC<Props> = ({
  categories,
  initialCategories,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>(
    initialCategories ? initialCategories : [],
  )

  const handleClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const newSelectedCategories = selectedCategorySlugs.includes(slug)
      ? selectedCategorySlugs.filter((item) => item !== slug)
      : [...selectedCategorySlugs, slug]

    if (newSelectedCategories.length) {
      params.set(EXPLORE_PARAMS.CATEGORY, newSelectedCategories.join(','))
    } else {
      params.delete(EXPLORE_PARAMS.CATEGORY)
    }

    const pageUrlParam = params.get(EXPLORE_PARAMS.PAGE)
    if (pageUrlParam) params.delete(EXPLORE_PARAMS.PAGE)

    setSelectedCategorySlugs(newSelectedCategories)

    router.push(`?${params.toString()}`)
  }

  return (
    <>
      {categories.map((category) => {
        // Get the icon component or default to MessageSquare
        const IconComponent =
          // @ts-expect-error error
          LucideIcons[category.iconName ?? 'MessageSquare']

        return (
          <Button
            key={category.id}
            variant='outline'
            onClick={() => handleClick(category.slug)}
            className={cn(
              'transition-all flex items-center gap-1 hover:border-primary hover:text-primary',
              {
                'border-primary text-primary': selectedCategorySlugs.includes(
                  category.slug,
                ),
              },
            )}
          >
            <div className={cn(category.colorClass || 'bg-primary/10')}>
              <IconComponent className='h-4 w-4' />
            </div>

            <span>{category.name}</span>
            <span>({category.count})</span>
          </Button>
        )
      })}
    </>
  )
}
