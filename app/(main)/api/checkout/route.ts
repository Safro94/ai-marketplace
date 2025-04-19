import { getPurchaseAmounts } from '@/app/(main)/checkout/_components/checkout-utils'
import { CheckoutPaymentDetails } from '@/lib/types'
import paypal from '@paypal/checkout-server-sdk'
import { NextResponse } from 'next/server'

// Creating an environment
const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string
const clientSecret = process.env.PAYPAL_SECRET as string

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret)
const client = new paypal.core.PayPalHttpClient(environment)

export async function POST(req: Request) {
  const request = new paypal.orders.OrdersCreateRequest()
  const {
    paypalData,
  }: {
    paypalData: CheckoutPaymentDetails[]
  } = await req.json()

  const { totalAmounts } = await getPurchaseAmounts()

  const units = paypalData.map((item, i) => {
    return {
      reference_id: `recipient_${i}`,
      amount: {
        value:
          totalAmounts.purchasedAssets[
            item.creatorProfileId!
          ].creatorAmount.toFixed(2),
        currency_code: 'USD',
      },
      payee: {
        email_address: item.accountIdentifier,
      }, // creator account
    }
  })

  request.requestBody({
    intent: 'CAPTURE',
    application_context: {
      shipping_preference: 'NO_SHIPPING',
    },
    purchase_units: [
      ...units,
      {
        reference_id: 'recipient_2',
        amount: {
          value: totalAmounts.totalServiceCharge.toFixed(2),
          currency_code: 'USD',
        },
        payee: {
          email_address: process.env.NEXT_PUBLIC_PAYPAL_EMAIL,
        }, // my account
      },
    ],
  })

  const response = await client.execute(request)

  return NextResponse.json({
    id: response.result.id,
  })
}
