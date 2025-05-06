import { FC } from 'react'
import { TemplateLayout } from './template-layout'

interface Props {
  name: string
  totalUses: number
  discountCode: string
  thresholdReached: number
  discountPercentage: number
}

export const DiscountCodeEarned: FC<Props> = ({
  name,
  totalUses,
  discountCode,
  thresholdReached,
  discountPercentage,
}) => (
  <TemplateLayout subject={`You've Earned a ${discountPercentage}% Discount!`}>
    <h1>Congratulations, {name}!</h1>

    <p>
      Your referral code has been used {totalUses} times, which means
      you&apos;ve reached the {thresholdReached} uses threshold!
    </p>

    <p>
      As a reward, you&apos;ve earned a <strong>{discountPercentage}%</strong>{' '}
      discount on your next purchase.
    </p>

    <p>
      Your discount code is: <strong>{discountCode}</strong>
    </p>

    <p>Thank you for sharing our platform with others!</p>
  </TemplateLayout>
)
