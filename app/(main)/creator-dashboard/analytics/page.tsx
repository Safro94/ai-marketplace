import { PageContainer } from '@/components/page-container'
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb'
import { ROUTES } from '@/lib/constants'
import { redirect } from 'next/navigation'
import { validateCreatorDashboardAccess } from '../utils'
import CreatorAnalytics from './_components/creator-analytics'

export default async function CreatorAnalyticsPage() {
  await validateCreatorDashboardAccess()

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
