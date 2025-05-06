import { FC } from 'react'
import { TemplateLayout } from './template-layout'

export const CreatorApplicationApproved: FC<{ name: string }> = ({ name }) => (
  <TemplateLayout subject='Congratulations! Your application has been approved'>
    <p>Dear {name},</p>

    <p>
      We are pleased to inform you that your application has been approved, you
      can now start uploading and selling your assets.
    </p>

    <p>Thank you for submitting your application!</p>
  </TemplateLayout>
)
