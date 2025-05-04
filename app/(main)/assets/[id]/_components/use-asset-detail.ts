import { toast } from '@/components/ui/toast'
import { checkUserPurchasedAsset } from '@/data-access/purchases'
import { useAuth } from '@/hooks/use-auth'
import { API_ROUTES } from '@/lib/constants'
import { AsyncReturnType } from '@/lib/types'
import { useEffect, useState } from 'react'

export const useAssetDetail = (assetId: string) => {
  const { user } = useAuth()

  const [userPurchaseData, setUserPurchaseData] = useState<AsyncReturnType<
    typeof checkUserPurchasedAsset
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

    if (user) fetchUserData()
  }, [assetId, user])

  return {
    userPurchaseData,
  }
}
