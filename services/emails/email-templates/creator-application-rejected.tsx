import { FC } from 'react'
import { TemplateLayout } from './template-layout'

interface Props {
  name: string
  notes: string | undefined
}

export const CreatorApplicationRejected: FC<Props> = ({ name, notes }) => (
  <TemplateLayout subject='Your application has been rejected'>
    <p>Dear {name},</p>

    <p>
      We are sorry to inform you that your application has been rejected. You
      can see the reason why below
    </p>

    <p>{notes || 'No additional information'}</p>
  </TemplateLayout>
)
