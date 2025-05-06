import { FC } from 'react'
import { TemplateLayout } from './template-layout'

interface Props {
  name: string
  totalSales: number
  salesThreshold: number
  oldCommissionRate: number
  newCommissionRate: number
}

export const CreatorCommissionRateLowered: FC<Props> = ({
  name,
  totalSales,
  salesThreshold,
  oldCommissionRate,
  newCommissionRate,
}) => (
  <TemplateLayout subject='Your Creator Commission Rate Has Improved!'>
    <h1>Great news, {name}!</h1>

    <p>
      The sales generated through your creator referral code have reached{' '}
      <strong>{totalSales}</strong>, crossing our {salesThreshold} threshold!
    </p>

    <p>
      As a result, your commission rate has improved from {oldCommissionRate}%
      to <strong>{newCommissionRate}%</strong>.
    </p>

    <p>
      This means you&apos;ll keep more of what you earn on all future referral
      sales.
    </p>

    <p>Thank you for being a valued creator on our platform!</p>
  </TemplateLayout>
)
