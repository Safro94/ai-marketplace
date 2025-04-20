import { PageContainer } from '@/components/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { APP_DATA } from '@/lib/constants'
import { getLicenseTerms } from '@/lib/license-utils'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>
}): Promise<Metadata> {
  const type = (await params).type
  const licenseType = decodeURIComponent(type)

  return {
    title: `${licenseType} Terms | ${APP_DATA.name}`,
    description: `Full terms and conditions for the ${licenseType}`,
  }
}

export default async function LicenseTermsPage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const type = (await params).type
  const licenseType = decodeURIComponent(type)
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
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle>{licenseType} Terms</CardTitle>
        </CardHeader>

        <CardContent className='prose dark:prose-invert max-w-none'>
          <ReactMarkdown>{terms}</ReactMarkdown>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
