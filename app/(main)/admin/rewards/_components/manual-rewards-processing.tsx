'use client'

import { LoadingButton } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/toast'
import { API_ROUTES, ROUTES } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const ManualRewardsProcessing = () => {
  const router = useRouter()

  const [isProcessing, setIsProcessing] = useState(false)
  const [forceProcess, setForceProcess] = useState(false)

  const triggerRewardsProcessing = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch(
        `${API_ROUTES.adminRewards()}?force=${forceProcess}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process rewards')
      }

      toast.success('Success', {
        description: data.message,
      })

      router.push(ROUTES.admin())
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Unexpected error',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Rewards Processing</CardTitle>
        <CardDescription>
          Manually trigger the processing of user discount codes and creator
          commission rates
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className='flex items-center space-x-2 mb-4'>
          <Checkbox
            id='force-process'
            checked={forceProcess}
            onCheckedChange={(checked) => setForceProcess(checked === true)}
          />

          <label
            htmlFor='force-process'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Force processing (ignore date check)
          </label>
        </div>

        <p className='text-sm text-muted-foreground'>
          Normally, this process runs automatically on the last day of each
          month. Use this option to run it manually for testing or if the
          automated process failed.
        </p>
      </CardContent>

      <CardFooter>
        <LoadingButton
          isLoading={isProcessing}
          onClick={triggerRewardsProcessing}
          disabled={isProcessing || !forceProcess}
        >
          Process Rewards Now
        </LoadingButton>
      </CardFooter>
    </Card>
  )
}
