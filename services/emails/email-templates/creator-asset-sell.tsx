import { FC } from 'react'
import { TemplateLayout } from './template-layout'

interface Props {
  assetName: string
  creatorUsername: string
}

export const CreatorAssetSell: FC<Props> = ({ assetName, creatorUsername }) => (
  <TemplateLayout subject='Congratulations! Your asset has been purchased'>
    <p>Dear {creatorUsername},</p>

    <p>
      We are pleased to inform you that someone has bought your asset{' '}
      <strong>{assetName}</strong>. The asset has been delivered to the
      customer, and your payment has been processed.
    </p>

    <p>Thank you for your great work!</p>
  </TemplateLayout>
)
