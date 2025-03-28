import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getLicenseTerms } from '@/lib/license-utils'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

export async function generateMetadata({
  params,
}: {
  params: { type: string }
}): Promise<Metadata> {
  const licenseType = decodeURIComponent(params.type)

  return {
    title: `${licenseType} Terms | AI Assets Marketplace`,
    description: `Full terms and conditions for the ${licenseType}`,
  }
}

export default function LicenseTermsPage({
  params,
}: {
  params: { type: string }
}) {
  const licenseType = decodeURIComponent(params.type)
  const validLicenseTypes = [
    'Standard License',
    'Extended License',
    'Enterprise License',
  ]

  if (!validLicenseTypes.includes(licenseType)) {
    notFound()
  }

  const terms = getLicenseTerms(licenseType)

  return (
    <div className='container py-12'>
      <div className='max-w-4xl mx-auto'>
        <Card>
          <CardHeader>
            <CardTitle>{licenseType} Terms</CardTitle>
          </CardHeader>

          <CardContent className='prose dark:prose-invert max-w-none'>
            <ReactMarkdown>{terms}</ReactMarkdown>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
