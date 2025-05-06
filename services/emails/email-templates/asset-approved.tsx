import { FC } from 'react'
import { TemplateLayout } from './template-layout'

interface Props {
  name: string
  assetName: string
}

export const AssetApproved: FC<Props> = ({ name, assetName }) => (
  <TemplateLayout subject='Congratulations! Your asset has been approved'>
    <p>Dear {name},</p>

    <p>
      We are pleased to inform you that your asset <strong>{assetName}</strong>{' '}
      has been approved and it&apos;s ready to be sold. It can take some time
      for your asset to appear in the explore page, we appreciate your patience.
    </p>

    <p>Thank you for submitting your asset!</p>
  </TemplateLayout>
)
