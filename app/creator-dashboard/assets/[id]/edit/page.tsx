import { PageContainer } from '@/components/page-container'
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb'
import { toast } from '@/components/ui/toast'
import { getAssetById } from '@/data-access/assets'
import { getCategoriesWithCount } from '@/data-access/categories'
import { getUserProfile } from '@/data-access/profile'
import { ROUTES } from '@/lib/constants'
import { isAdminOrCreator } from '@/lib/permissions'
import { getServerSession } from '@/lib/session'
import { tryCatch } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { AssetUploadForm } from '../../../_components/asset-upload-form'

export default async function EditAssetPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession()

  if (!session?.user) {
    redirect(ROUTES.login())
  }

  // Get creator profile
  const profile = await getUserProfile(session.user.id)

  if (!profile || !isAdminOrCreator(profile)) {
    redirect(ROUTES.creators())
  }

  const assetId = (await params).id

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

  const { data, error } = await tryCatch(getCategoriesWithCount())

  if (error) {
    toast.error('Error', {
      description: 'Failed to fetch categories',
    })
    redirect(ROUTES.creatorDashboard())
  }

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

      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tight mb-2'>
          Edit {asset.title}
        </h1>

        <p className='text-muted-foreground'>
          Update your asset details and licensing options
        </p>
      </div>

      <AssetUploadForm categories={data} initialData={asset} />
    </PageContainer>
  )
}
