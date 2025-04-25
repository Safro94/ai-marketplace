import { PageContainer } from '@/components/page-container'
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb'
import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import { validateSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import CreatorAnalytics from './_components/creator-analytics'

export default async function CreatorAnalyticsPage() {
  const { user } = await validateSession(ROUTES.creatorDashboard())
  const profile = await getUserProfile(user.id)

  if (!profile || !isAdminOrCreator(profile)) {
    redirect(ROUTES.creators())
  }

  //TODO: remove once we have premium subscriptions
  redirect(ROUTES.creatorDashboard())

  return (
    <PageContainer>
      <BreadcrumbNavigation
        items={[
          {
            text: 'Creator Dashboard',
            link: ROUTES.creatorDashboard(),
          },
          {
            text: 'Analytics',
          },
        ]}
      />

      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight'>Analytics</h1>
      </div>

      <CreatorAnalytics />
    </PageContainer>
  )
}
