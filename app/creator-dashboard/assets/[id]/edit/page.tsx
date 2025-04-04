import { AssetUploadForm } from '@/app/creator-dashboard/upload/asset-upload-form'
import { PageContainer } from '@/components/page-container'
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  params: { id: string }
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
    where: { id: params.id },
    include: {
      assetLicenses: {
        include: {
          license: true,
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
      <h1 className='text-3xl font-bold mb-8'>Edit Asset</h1>

      <Card>
        <CardHeader>
          <CardTitle>Edit {asset.title}</CardTitle>
          <CardDescription>
            Update your asset details and licensing options
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AssetUploadForm categories={data} initialData={asset} />
        </CardContent>
      </Card>
    </PageContainer>
  )
}
