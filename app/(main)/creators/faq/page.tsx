import { PageContainer } from '@/components/page-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { APP_DATA } from '@/lib/constants'
import { CreatorFAQs } from '../_components/creator-faq'

export const metadata = {
  title: `Creator FAQ | ${APP_DATA.name}`,
  description: `Frequently asked questions for creators on the ${APP_DATA.name} platform.`,
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
