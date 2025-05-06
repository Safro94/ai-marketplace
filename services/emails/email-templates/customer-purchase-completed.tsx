import { ROUTES } from '@/lib/constants'
import { FC } from 'react'
import { TemplateLayout } from './template-layout'

export const CustomerPurchaseCompleted: FC<{ name: string }> = ({ name }) => {
  const purchasesUrl = `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.purchases()}`

  return (
    <TemplateLayout subject='Thank you for your puchase! Your order has been completed'>
      <p>Dear {name},</p>

      <p>
        Thank you for using our services. Your payment has been processed
        successfully. You can view and download your purchased asset(s) by
        clicking the link below:
      </p>

      <a href={purchasesUrl} target='_blank'>
        {purchasesUrl}
      </a>

      <p>
        If you have any questions or need further assistance, please don&apos;t
        hesitate to contact us.
      </p>
    </TemplateLayout>
  )
}
