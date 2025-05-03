import { ErrorToast } from '@/components/error-toast'
import { PageContainer } from '@/components/page-container'
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb'
import { getCategoriesWithCount } from '@/data-access/categories'
import { ROUTES } from '@/lib/constants'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { validateCreatorDashboardAccess } from '../../utils'
import { AssetUploadForm } from '../_components/asset-upload-form'

export const metadata: Metadata = {
  title: 'Upload Asset | Creator Dashboard',
  description: 'Upload a new AI asset to the marketplace',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function UploadAssetPage() {
  await validateCreatorDashboardAccess()

  const { data, error } = await getCategoriesWithCount()

  return (
    <PageContainer className='md:p-0'>
      <BreadcrumbNavigation
        items={[
          {
            text: 'Creator Dashboard Products',
            link: ROUTES.creatorDashboardAssets(),
          },
          {
            text: 'Upload product',
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
          Upload New Product
        </h1>
        <p className='text-muted-foreground'>
          Fill out the form below to submit your AI product for review
        </p>
      </div>

      {data && <AssetUploadForm categories={data} />}

      <div className='mt-8 text-center text-sm text-muted-foreground'>
        <p>
          All products are reviewed by our team before being published on the
          marketplace. This process typically takes 1-2 business days.
        </p>
      </div>
    </PageContainer>
  )
}
