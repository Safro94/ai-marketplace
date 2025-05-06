import { FC } from 'react'
import { TemplateLayout } from './template-layout'

interface Props {
  name: string
  assetName: string
}

export const AssetRejected: FC<Props> = ({ name, assetName }) => (
  <TemplateLayout subject='Your asset has been rejected'>
    <p>Dear {name},</p>

    <p>
      We are sorry to inform you that your asset <strong>{assetName}</strong>{' '}
      has been rejected and won&apos;t be added to our website. If you want to
      know why, you can see the reason in your creator dashboard.
    </p>
  </TemplateLayout>
)
