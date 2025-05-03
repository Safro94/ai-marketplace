import { CopyToClipboard } from '@/components/copy-to-clipboard'
import { GenerateNewAffiliateCode } from '@/components/generate-new-affiliate-code'
import { PageContainer } from '@/components/page-container'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { InputWithIcon } from '@/components/ui/input'
import { getDefaultAffiliateCodeByCreatorProfileId } from '@/data-access/affiliate-codes'
import { getCreatorProfileByProfileId } from '@/data-access/creator-profile'
import { ROUTES } from '@/lib/constants'
import { redirect } from 'next/navigation'
import { validateCreatorDashboardAccess } from '../utils'

export default async function Page() {
  const { profile } = await validateCreatorDashboardAccess()

  // Get creator profile
  const creatorProfile = await getCreatorProfileByProfileId(profile.id)

  if (!creatorProfile) {
    redirect(ROUTES.creators())
  }

  const data = await getDefaultAffiliateCodeByCreatorProfileId(
    creatorProfile.id,
  )

  return (
    <PageContainer className='md:p-0'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Affiliate code</h1>
      </div>

      <Card className='pt-4'>
        <CardHeader>
          <CardTitle>Your affiliate code</CardTitle>
          <CardDescription>
            Share this code with your audience to reduce your commision rate.
            You will be able to track your code performance in the future.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {data?.code ? (
            <div className='flex flex-col md:flex-row gap-4'>
              <InputWithIcon
                defaultValue={data.code}
                icon={<CopyToClipboard data={data.code} />}
              />

              <GenerateNewAffiliateCode isCreatorCode id={creatorProfile.id} />
            </div>
          ) : (
            <div className='text-center py-8'>
              <p className='text-muted-foreground'>No affiliate code found</p>
              <p className='text-xs text-muted-foreground mt-1'>
                Please contact support to create your affiliate code.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
