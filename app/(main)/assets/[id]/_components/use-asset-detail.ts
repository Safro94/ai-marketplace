import { toast } from '@/components/ui/toast'
import { checkUserPurchasedAsset } from '@/data-access/purchases'
import { API_ROUTES } from '@/lib/constants'
import { useEffect, useState } from 'react'

export const useAssetDetail = (assetId: string) => {
  const [userPurchaseData, setUserPurchaseData] = useState<Awaited<
    ReturnType<typeof checkUserPurchasedAsset>
  > | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(API_ROUTES.assetUserPurchase(assetId))

        if (!response.ok) {
          toast.error('Error', {
            description: 'Failed to fetch user purchase data',
          })

          return
        }

        const data = await response.json()
        setUserPurchaseData(data)
      } catch (error) {
        console.error('Failed to fetch user purchase data', error)
      }
    }

    fetchUserData()
  }, [assetId])

  return {
    userPurchaseData,
  }
}
