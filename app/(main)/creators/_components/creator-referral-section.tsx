import {
  HomeSection,
  HomeSectionDescription,
  HomeSectionTitle,
  HomeSectionTitleContainer,
} from '@/components/page-container'
import { LOWEST_SERVICE_CHARGE, SERVICE_CHARGE } from '@/lib/constants'

const tiers = [
  {
    salesThreshold: '$0 - $250',
    commissionRate: `${SERVICE_CHARGE * 100}%`,
    isDefault: true,
  },
  {
    salesThreshold: '$250 - $1,000',
    commissionRate: '22.5%',
  },
  {
    salesThreshold: '$1,000 - $2,500',
    commissionRate: '20%',
  },
  {
    salesThreshold: '$2,500 - $5,000',
    commissionRate: '17.5%',
  },
  {
    salesThreshold: '$5,000+',
    commissionRate: `${LOWEST_SERVICE_CHARGE * 100}%`,
  },
]

export const CreatorReferralSection = () => {
  return (
    <HomeSection>
      <HomeSectionTitleContainer>
        <HomeSectionTitle>Referral Commission Structure</HomeSectionTitle>

        <HomeSectionDescription>
          As a creator, you earn through your sales and your referral code. The
          more sales your referrals generate, the lower your commission rate
          becomes - meaning you keep more of what you earn.
        </HomeSectionDescription>
      </HomeSectionTitleContainer>

      <div className='overflow-x-auto flex justify-center'>
        <table className='bg-background shadow-sm rounded-xl overflow-hidden text-center'>
          <thead className='bg-primary text-white dark:text-primary-foreground'>
            <tr>
              <th className='py-4 px-6'>
                Sales generated through referral code
              </th>
              <th className='py-4 px-6'>Your commission rate</th>
            </tr>
          </thead>

          <tbody>
            {tiers.map((tier, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0 ? 'bg-background/40' : 'bg-background'
                }
              >
                <td className='py-4 px-6 border-t'>
                  <div className='font-medium'>{tier.salesThreshold}</div>

                  {tier.isDefault && (
                    <div className='text-sm text-muted-foreground'>
                      Starting tier
                    </div>
                  )}
                </td>

                <td className='py-4 px-6 border-t'>
                  <div className='font-bold text-lg text-primary dark:text-white'>
                    {tier.commissionRate}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HomeSection>
  )
}
