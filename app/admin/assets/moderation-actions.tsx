'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { API_ROUTES } from '@/lib/constants'
import { AssetStatus } from '@prisma/client'
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { FeatureAssetButton } from './feature-asset-button'

interface Props {
  assetId: string
  isFeatured: boolean
}

export const ModerationActions: FC<Props> = ({ assetId, isFeatured }) => {
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleModeration = async (status: AssetStatus) => {
    try {
      setIsSubmitting(true)

      const response = await fetch(API_ROUTES.assetAdminModeration(assetId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notes,
        }),
      })

      if (!response.ok) throw new Error('Failed to update asset status')

      toast(
        status === AssetStatus.PUBLISHED ? 'Asset approved' : 'Asset rejected',
        {
          description: 'The asset has been updated successfully.',
        },
      )

      // Refresh the page
      router.refresh()
    } catch (error) {
      console.error(error)

      toast.error('Error', {
        description: 'Failed to update asset status. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-4'>
      <Textarea
        placeholder='Add moderation notes (optional)'
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className='min-h-[80px]'
      />

      <div className='flex space-x-2'>
        <Button
          variant='outline'
          className='flex-1 border-red-200 hover:bg-red-50 hover:text-red-600'
          onClick={() => handleModeration(AssetStatus.REJECTED)}
          disabled={isSubmitting}
        >
          <XCircle className='h-4 w-4 mr-2' />
          Reject
        </Button>

        <Button
          variant='outline'
          className='flex-1 border-green-200 hover:bg-green-50 hover:text-green-600'
          onClick={() => handleModeration(AssetStatus.PUBLISHED)}
          disabled={isSubmitting}
        >
          <CheckCircle className='h-4 w-4 mr-2' />
          Approve
        </Button>

        <div className='pt-2'>
          <FeatureAssetButton assetId={assetId} isFeatured={isFeatured} />
        </div>
      </div>
    </div>
  )
}
