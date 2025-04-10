import { AssetUploadForm } from '@/app/creator-dashboard/upload/asset-upload-form'
import { PageContainer } from '@/components/page-container'
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb'
import { toast } from '@/components/ui/toast'
import { ROUTES } from '@/lib/constants'
import { getCategories } from '@/lib/db/categories'
import { isAdminOrCreator } from '@/lib/db/permissions'
import prisma from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { tryCatch } from '@/lib/utils'
import { redirect } from 'next/navigation'

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
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile || !isAdminOrCreator(profile)) {
    redirect(ROUTES.creators())
  }

  // Get asset
  const asset = await prisma.asset.findUnique({
    where: { id: (await params).id },
    include: {
      assetLicenses: {
        select: {
          licenseId: true,
          price: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  if (!asset) redirect(ROUTES.creatorDashboard())

  // Check if user is the creator
  if (asset.creatorId !== profile.id) {
    redirect(ROUTES.creatorDashboard())
  }

  const { data, error } = await tryCatch(getCategories())

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
