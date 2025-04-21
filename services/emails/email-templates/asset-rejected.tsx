import { APP_DATA } from '@/lib/constants'
import { FC } from 'react'
import { TemplateLayout } from './template-layout'

interface Props {
  assetName: string
}

export const AssetRejected: FC<Props> = ({ assetName }) => (
  <TemplateLayout subject='Your asset has been rejected'>
    <p>Dear Creator,</p>

    <p>
      We are sorry to inform you that your asset <strong>{assetName}</strong>{' '}
      has been rejected and won&apos;t be added to our website. If you want to
      know why, you can see the reason in your creator dashboard.
    </p>

    <p>
      Best Regards,
      <br />
      <strong>{APP_DATA.name} Team</strong>
    </p>
  </TemplateLayout>
)
