'use client'

import dynamic from 'next/dynamic'
import { ComponentProps } from 'react'

const AssetAddToCartButton = dynamic(
  () =>
    import('@/components/asset-add-to-cart-button').then(
      (item) => item.AssetAddToCartButton,
    ),
  {
    ssr: false,
  },
)

export const AssetAddToCartButtonWrapper = (
  props: ComponentProps<typeof AssetAddToCartButton>,
) => {
  return <AssetAddToCartButton {...props} />
}
