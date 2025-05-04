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
import { getCreatorProfileByProfileId } from '@/data-access/creator-profile'
import { CREATOR_AFFILIATE_MILESTONES, ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { ShoppingBag, TrendingUp } from 'lucide-react'
import { redirect } from 'next/navigation'
import { validateCreatorDashboardAccess } from '../utils'

export default async function Page() {
  const { profile } = await validateCreatorDashboardAccess()

  // Get creator profile
  const creatorProfile = await getCreatorProfileByProfileId(profile.id)

  if (!creatorProfile) {
    redirect(ROUTES.creators())
  }

  const data = await getDefaultAffiliateCodeById({
    creatorProfile,
  })

  // Find the next milestone
  const currentMilestone =
    CREATOR_AFFILIATE_MILESTONES.find(
      (milestone) => milestone.amount > data.totalSales,
    ) || CREATOR_AFFILIATE_MILESTONES[CREATOR_AFFILIATE_MILESTONES.length - 1]

  // Calculate progress percentage to the next milestone
  const previousMilestoneAmount =
    CREATOR_AFFILIATE_MILESTONES[
      CREATOR_AFFILIATE_MILESTONES.indexOf(currentMilestone) - 1
    ]?.amount || 0

  const progressToNextMilestone =
    ((data.totalSales - previousMilestoneAmount) /
      (currentMilestone.amount - previousMilestoneAmount)) *
    100

  // Amount left to reach the next milestone
  const amountLeft = currentMilestone.amount - data.totalSales

  return (
    <DashboardPageContainer title='Code Performance'>
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
              <GenerateNewAffiliateCode isCreatorCode id={creatorProfile.id} />
            </div>

            <div className='grid grid-cols-2 gap-4 mt-6'>
              <div className='flex flex-col'>
                <span className='text-sm text-muted-foreground'>
                  Usage Count
                </span>

                <div className='flex items-center'>
                  <ShoppingBag className='h-4 w-4 mr-2 text-primary' />
                  <span className='text-2xl font-bold'>{data.totalUses}</span>
                </div>
              </div>

              <div className='flex flex-col'>
                <span className='text-sm text-muted-foreground'>
                  Total Sales
                </span>

                <span className='text-2xl font-bold'>
                  {formatCurrency(data.totalSales)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-xl'>Milestone Progress</CardTitle>
            <CardDescription>
              {amountLeft > 0
                ? `$${amountLeft} left to reach ${currentMilestone.label}`
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
                {CREATOR_AFFILIATE_MILESTONES.map((milestone, index) => (
                  <div
                    key={index}
                    className='flex flex-col items-center'
                    style={{
                      opacity: milestone.amount <= data.totalSales ? 1 : 0.5,
                    }}
                  >
                    <div
                      className={`w-4 h-4 rounded-full mb-1 ${
                        milestone.amount <= data.totalSales
                          ? 'bg-primary'
                          : 'bg-gray-300'
                      }`}
                    />

                    <span className='text-xs font-medium'>
                      {milestone.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className='mt-4 p-3 bg-primary rounded-md text-white'>
                <div className='flex items-center'>
                  <TrendingUp className='h-4 w-4 mr-2' />

                  <span className='text-sm font-medium'>
                    Average sales per use: $
                    {formatCurrency(data.totalSales / data.totalUses)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageContainer>
  )
}
