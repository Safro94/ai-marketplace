import { getPurchaseAmounts } from '@/app/(main)/checkout/_components/checkout-utils'
import { getAffiliateCodeByCode } from '@/data-access/affiliate-codes'
import { CheckoutPaymentDetails } from '@/lib/types'
import paypal from '@paypal/checkout-server-sdk'
import { NextResponse } from 'next/server'
import { validateRouteProfilePermissions } from '../utils'

// Create PayPal Client
function createPayPalClient() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string
  const clientSecret = process.env.PAYPAL_SECRET as string
  const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret)
  return new paypal.core.PayPalHttpClient(environment)
}

const client = createPayPalClient()

export async function POST(req: Request) {
  const { profile } = await validateRouteProfilePermissions()

  try {
    const {
      paypalData,
      affiliateCode,
    }: { paypalData: CheckoutPaymentDetails[]; affiliateCode: string } =
      await req.json()

    let dbAffiliateCode

    if (affiliateCode) {
      dbAffiliateCode = await getAffiliateCodeByCode(affiliateCode)
    }

    const { totalAmounts } = await getPurchaseAmounts(
      dbAffiliateCode?.discountPercentage,
    )

    const units = paypalData.map((item, i) => {
      const creatorAmount =
        totalAmounts.purchasedAssets[
          item.creatorProfileId!
        ].creatorAmount.toFixed(2)

      return {
        reference_id: `recipient_${i}`,
        amount: {
          currency_code: 'USD',
          value: creatorAmount,
        },
        payee: {
          email_address: item.accountIdentifier,
        },
      }
    })

    const platformFeeUnit = {
      reference_id: 'platform_fee',
      amount: {
        currency_code: 'USD',
        value: totalAmounts.totalServiceCharge.toFixed(2),
      },
      payee: {
        email_address: process.env.NEXT_PUBLIC_PAYPAL_EMAIL,
      },
    }
    const request = new paypal.orders.OrdersCreateRequest()

    request.prefer('return=representation')
    request.requestBody({
      intent: 'CAPTURE',
      application_context: {
        brand_name: 'AIAssetHub.pro',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
      purchase_units: [...units, platformFeeUnit],
    })

    const response = await client.execute(request)

    return NextResponse.json({
      id: response.result.id,
    })
  } catch (e) {
    console.error('PayPal order creation failed:', e)
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 },
    )
  }
}
