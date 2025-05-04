import { CopyToClipboard } from '@/components/copy-to-clipboard'
import { GenerateNewAffiliateCode } from '@/components/generate-new-affiliate-code'
import { DashboardPageContainer } from '@/components/page-container'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getDefaultAffiliateCodeById } from '@/data-access/affiliate-codes'
import { USER_AFFILIATE_MILESTONES } from '@/lib/constants'
import { getCachedProfileData } from '../utils'

export default async function Downloads() {
  const { profile } = await getCachedProfileData()

  const data = await getDefaultAffiliateCodeById({
    profileId: profile.id,
  })

  // Find the next milestone
  const currentMilestone =
    USER_AFFILIATE_MILESTONES.find((milestone) => milestone > data.totalUses) ||
    USER_AFFILIATE_MILESTONES[USER_AFFILIATE_MILESTONES.length - 1]

  // Calculate progress percentage to the next milestone
  const previousMilestoneAmount =
    USER_AFFILIATE_MILESTONES[
      USER_AFFILIATE_MILESTONES.indexOf(currentMilestone) - 1
    ] || 0

  const progressToNextMilestone =
    ((data.totalUses - previousMilestoneAmount) /
      (currentMilestone - previousMilestoneAmount)) *
    100

  // Amount left to reach the next milestone
  const amountLeft = currentMilestone - data.totalUses

  return (
    <DashboardPageContainer
      title='Recent Sales'
      description='Your most recent asset purchases'
    >
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-xl'>Code Details</CardTitle>
            <CardDescription>
              Your active code. Please avoid generating a new code unless it is
              strictly necessary.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className='flex flex-col md:flex-row gap-2'>
              <CopyToClipboard data={data.code} />
              <GenerateNewAffiliateCode isCreatorCode={false} id={profile.id} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-xl'>Milestone Progress</CardTitle>
            <CardDescription>
              {amountLeft > 0
                ? `${amountLeft} uses left to reach ${currentMilestone}`
                : 'All milestones reached!'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className='space-y-6'>
              <Progress
                value={progressToNextMilestone}
                className='h-3 bg-gray-200'
              />

              <div className='flex justify-between'>
                {USER_AFFILIATE_MILESTONES.map((milestone, index) => (
                  <div
                    key={index}
                    className='flex flex-col items-center'
                    style={{
                      opacity: milestone <= data.totalUses ? 1 : 0.5,
                    }}
                  >
                    <div
                      className={`w-4 h-4 rounded-full mb-1 ${
                        milestone <= data.totalUses
                          ? 'bg-primary'
                          : 'bg-gray-300'
                      }`}
                    />

                    <span className='text-xs font-medium'>{milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageContainer>
  )
}
