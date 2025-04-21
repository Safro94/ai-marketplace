import { APP_DATA, ROUTES } from '@/lib/constants'
import { TemplateLayout } from './template-layout'

export const CustomerPurchaseCompleted = () => {
  const purchasesUrl = `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.purchases()}`

  return (
    <TemplateLayout subject='Thank you for your puchase! Your order has been completed'>
      <p>Dear customer,</p>

      <p>
        Thank you for using our services. Your payment has been processed. You
        can see your puchased asset(s) and download them by clicking the link
        below:
      </p>

      <a href={purchasesUrl} target='_blank'>
        {purchasesUrl}
      </a>

      <p>
        Best Regards,
        <br />
        <strong>{APP_DATA.name} Team</strong>
      </p>
    </TemplateLayout>
  )
}
