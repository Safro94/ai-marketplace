import { ErrorToast } from '@/components/error-toast'
import { PageContainer } from '@/components/page-container'
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb'
import { getAssetById } from '@/data-access/assets'
import { getCategoriesWithCount } from '@/data-access/categories'
import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import { validateSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { AssetUploadForm } from '../../_components/asset-upload-form'

export default async function EditAssetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const assetId = (await params).id

  const session = await validateSession(
    ROUTES.creatorDashboardAssetEdit(assetId),
  )

  if (!session?.user) {
    redirect(ROUTES.login())
  }

  // Get creator profile
  const profile = await getUserProfile(session.user.id)

  if (!profile || !isAdminOrCreator(profile)) {
    redirect(ROUTES.creators())
  }

  // Get asset
  const asset = await getAssetById(assetId, {
    assetLicenses: {
      select: {
        licenseId: true,
        price: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    },
  })

  if (!asset) redirect(ROUTES.creatorDashboard())

  // Check if user is the creator
  if (asset.creatorId !== profile.id) {
    redirect(ROUTES.creatorDashboard())
  }

  const { data, error } = await getCategoriesWithCount()

  return (
    <PageContainer>
      <BreadcrumbNavigation
        items={[
          { text: 'Creator Dashboard', link: ROUTES.creatorDashboard() },
          {
            text: 'Edit Asset',
          },
        ]}
      />

      <Suspense>
        {error && (
          <ErrorToast error='There was an error while fetching the categories' />
        )}
      </Suspense>

      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight mb-2'>
          Edit {asset.title}
        </h1>

        <p className='text-muted-foreground'>
          Update your asset details and licensing options
        </p>
      </div>

      {data && <AssetUploadForm categories={data} initialData={asset} />}
    </PageContainer>
  )
}
