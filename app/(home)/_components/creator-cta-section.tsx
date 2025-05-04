import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
  HomeSectionTitleContainer,
} from '@/components/page-container'
import { Button, ButtonProps } from '@/components/ui/button'
import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import { getServerSession } from '@/lib/session'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

export const CreatorCTASection: FC<{
  btnVariant?: ButtonProps['variant']
  classNames?: {
    section?: string
    title?: string
  }
}> = async ({ classNames, btnVariant = 'outline' }) => {
  const session = await getServerSession()
  let profile

  if (session?.user) {
    profile = await getUserProfile(session?.user.id)
  }

  if (isAdminOrCreator(profile)) return null

  return (
    <HomeSection className={cn('bg-primary', classNames?.section)}>
      <HomeSectionTitleContainer>
        <HomeSectionTitle className={cn('text-white', classNames?.title)}>
          Ready to Share Your AI Assets?
        </HomeSectionTitle>

        <HomeSectionDescription className='text-slate-400'>
          Join our growing community of creators and start earning from your AI
          expertise.
        </HomeSectionDescription>
      </HomeSectionTitleContainer>

      <div className='flex flex-col gap-2 items-center'>
        <Button
          size='lg'
          asChild
          variant={btnVariant ?? 'outline'}
          className={cn('w-fit', btnVariant === 'outline' && 'text-white')}
        >
          <Link href={ROUTES.creators()}>
            Get started now
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      </div>
    </HomeSection>
  )
}
