import { ROUTES } from '@/lib/constants'
import { FC } from 'react'
import { TemplateLayout } from './template-layout'

export const CustomerPurchaseCompleted: FC<{ name: string }> = ({ name }) => {
  const purchasesUrl = `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.purchases()}`

  return (
    <TemplateLayout subject='Thank you for your puchase! Your order has been completed'>
      <p>Dear {name},</p>

      <p>
        Thank you for using our services. Your payment has been processed. You
        can see your puchased asset(s) and download them by clicking the link
        below:
      </p>

      <a href={purchasesUrl} target='_blank'>
        {purchasesUrl}
      </a>
    </TemplateLayout>
  )
}
