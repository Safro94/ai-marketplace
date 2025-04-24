import { ErrorToast } from '@/components/error-toast'
import { PageContainer } from '@/components/page-container'
import { BreadcrumbNavigation } from '@/components/ui/breadcrumb'
import { getCategoriesWithCount } from '@/data-access/categories'
import { ROUTES } from '@/lib/constants'
import type { Metadata } from 'next'
import { Suspense } from 'react'
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
  const { data, error } = await getCategoriesWithCount()

  return (
    <PageContainer>
      <BreadcrumbNavigation
        items={[
          {
            text: 'Creator Dashboard',
            link: ROUTES.creatorDashboard(),
          },
          {
            text: 'Upload asset',
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
          Upload New Asset
        </h1>
        <p className='text-muted-foreground'>
          Fill out the form below to submit your AI asset for review
        </p>
      </div>

      {data && <AssetUploadForm categories={data} />}

      <div className='mt-8 text-center text-sm text-muted-foreground'>
        <p>
          All assets are reviewed by our team before being published on the
          marketplace. This process typically takes 1-2 business days.
        </p>
      </div>
    </PageContainer>
  )
}
