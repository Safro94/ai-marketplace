'use client'

import { saveAssetDetailVisit } from '@/actions/asset-view'
import { FC, useEffect } from 'react'

export const AssetDetailAnalytics: FC<{ assetId: string }> = ({ assetId }) => {
  useEffect(() => {
    let viewedAssets: string[] = []

    // Check localStorage for assetId
    if (typeof window !== 'undefined') {
      viewedAssets = JSON.parse(localStorage.getItem('viewedAssets') || '[]')

      if (!viewedAssets.includes(assetId)) {
        // store assetId in localStorage
        viewedAssets.push(assetId)
        localStorage.setItem('viewedAssets', JSON.stringify(viewedAssets))
      }
    }

    const trackView = async () => {
      try {
        await saveAssetDetailVisit(assetId, viewedAssets)
      } catch (error) {
        // Silent fail for analytics
        console.error('Failed to record asset visit', error)
      }
    }

    trackView()
  }, [assetId])

  return null
}
