'use client'

import { saveAssetDetailVisit } from '@/actions/asset-view'
import { FC, useEffect } from 'react'

export const AssetDetailAnalytics: FC<{ assetId: string }> = ({ assetId }) => {
  useEffect(() => {
    const trackView = async () => {
      try {
        await saveAssetDetailVisit(assetId)
      } catch (error) {
        // Silent fail for analytics
        console.error('Failed to record asset visit', error)
      }
    }

    trackView()
  }, [assetId])

  return null
}
