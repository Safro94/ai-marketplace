import { APP_DATA } from '@/lib/constants'
import { FC } from 'react'
import { TemplateLayout } from './template-layout'

interface Props {
  assetName: string
}

export const AssetApproved: FC<Props> = ({ assetName }) => (
  <TemplateLayout subject='Congratulations! Your asset has been approved'>
    <p>Dear Creator,</p>

    <p>
      We are pleased to inform you that your asset <strong>{assetName}</strong>{' '}
      has been approved and it&apos;s ready to be sold. It can take some time
      for your asset to appear in the explore page, we appreciate your patience.
    </p>

    <p>Thank you for submitting your asset!</p>

    <p>
      Best Regards,
      <br />
      <strong>{APP_DATA.name} Team</strong>
    </p>
  </TemplateLayout>
)
