import type { Metadata } from 'next'
import AssetUploadForm from './asset-upload-form'

export const metadata: Metadata = {
  title: 'Upload Asset | Creator Dashboard',
  description: 'Upload a new AI asset to the marketplace',
  robots: {
    index: false,
    follow: false,
  },
}

export default function UploadAssetPage() {
  return (
    <div className='container py-12'>
      <div className='max-w-5xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight mb-2'>
            Upload New Asset
          </h1>
          <p className='text-muted-foreground'>
            Fill out the form below to submit your AI asset for review
          </p>
        </div>

        <AssetUploadForm />

        <div className='mt-8 text-center text-sm text-muted-foreground'>
          <p>
            All assets are reviewed by our team before being published on the
            marketplace. This process typically takes 1-2 business days.
          </p>
        </div>
      </div>
    </div>
  )
}
