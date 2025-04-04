import { PageContainer } from '@/components/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreatorFAQs } from '../creator-faq'

export const metadata = {
  title: 'Creator FAQ | AI Assets Marketplace',
  description:
    'Frequently asked questions for creators on the AI Assets Marketplace platform.',
}

export default function CreatorFAQPage() {
  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle className='text-3xl'>
            Creator Frequently Asked Questions
          </CardTitle>
        </CardHeader>

        <CardContent>
          <CreatorFAQs />
        </CardContent>
      </Card>
    </PageContainer>
  )
}
