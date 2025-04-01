'use client'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { API_ROUTES } from '@/lib/constants'
import { StarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

interface Props {
  assetId: string
  isFeatured: boolean
}

export const FeatureAssetButton: FC<Props> = ({ assetId, isFeatured }) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggleFeatured = async () => {
    try {
      setIsSubmitting(true)

      const response = await fetch(API_ROUTES.assetAdminFeature(assetId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: !isFeatured,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update featured status')
      }

      toast.success(isFeatured ? 'Asset unfeatured' : 'Asset featured', {
        description: isFeatured
          ? 'The asset has been removed from featured assets.'
          : 'The asset has been added to featured assets.',
      })

      // Refresh the page
      router.refresh()
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to update featured status. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      variant='outline'
      onClick={handleToggleFeatured}
      disabled={isSubmitting}
      className={
        isFeatured
          ? 'border-yellow-200 bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
          : 'border-gray-200 hover:bg-yellow-100 hover:text-yellow-600'
      }
    >
      <StarIcon
        className={`h-4 w-4 mr-2 ${isFeatured ? 'fill-yellow-500' : ''}`}
      />
      {isFeatured ? 'Unfeature' : 'Feature'}
    </Button>
  )
}
