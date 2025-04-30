import { Purchase } from '@prisma/client'
import { FC } from 'react'
import { TemplateLayout } from './template-layout'

export const PlatformAssetPurchase: FC<Purchase> = (purchase) => (
  <TemplateLayout subject='Congratulations! Someone has purchased an asset'>
    <p>
      Purchase details: <pre>{JSON.stringify(purchase, null, 2)}</pre>
    </p>
  </TemplateLayout>
)
