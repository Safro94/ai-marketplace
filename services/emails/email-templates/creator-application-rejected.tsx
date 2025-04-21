import { APP_DATA } from '@/lib/constants'
import { FC } from 'react'
import { TemplateLayout } from './template-layout'

interface Props {
  notes: string | undefined
}

export const CreatorApplicationRejected: FC<Props> = ({ notes }) => (
  <TemplateLayout subject='Your application has been rejected'>
    <p>Dear Creator,</p>

    <p>
      We are sorry to inform you that your application has been rejected. You
      can see the reason why below
    </p>

    <p>{notes || 'No additional information'}</p>

    <p>
      Best Regards,
      <br />
      <strong>{APP_DATA.name} Team</strong>
    </p>
  </TemplateLayout>
)
