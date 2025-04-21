import { APP_DATA } from '@/lib/constants'
import { TemplateLayout } from './template-layout'

export const CreatorApplicationApproved = () => (
  <TemplateLayout subject='Congratulations! Your application has been approved'>
    <p>Dear Creator,</p>

    <p>
      We are pleased to inform you that your application has been approved, you
      can now start uploading and selling your assets.
    </p>

    <p>Thank you for submitting your application!</p>

    <p>
      Best Regards,
      <br />
      <strong>{APP_DATA.name} Team</strong>
    </p>
  </TemplateLayout>
)
