'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { API_ROUTES } from '@/lib/constants'
import { ApplicationStatus } from '@prisma/client'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

interface Props {
  applicationId: string
}

export const ApplicationReviewForm: FC<Props> = ({ applicationId }) => {
  const [reviewNotes, setReviewNotes] = useState('')
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const router = useRouter()

  const handleApprove = async () => {
    setIsApproving(true)

    try {
      const response = await fetch(
        `${API_ROUTES.adminCreatorApplications()}/${applicationId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: ApplicationStatus.APPROVED,
            reviewNotes,
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to approve application')
      }

      toast.success('Application approved', {
        description: 'The creator application has been approved successfully.',
      })

      router.refresh()
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Something went wrong',
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!reviewNotes.trim()) {
      toast.error('Review notes required', {
        description:
          'Please provide feedback on why the application was rejected.',
      })
      return
    }

    setIsRejecting(true)

    try {
      const response = await fetch(
        `${API_ROUTES.adminCreatorApplications()}/${applicationId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'REJECTED',
            reviewNotes,
          }),
        },
      )

      if (!response.ok) throw new Error('Failed to reject application')

      toast.success('Application rejected', {
        description: 'The creator application has been rejected.',
      })

      router.refresh()
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error ? error.message : 'Something went wrong',
      })
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Application</CardTitle>
        <CardDescription>
          Approve or reject this creator application
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className='space-y-4'>
          <div>
            <label
              htmlFor='reviewNotes'
              className='block text-sm font-medium mb-2'
            >
              Review Notes
            </label>
            <Textarea
              id='reviewNotes'
              placeholder='Provide feedback or notes about this application...'
              rows={5}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
            />
            <p className='mt-2 text-sm text-muted-foreground'>
              These notes will be visible to the applicant.
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className='flex justify-between'>
        <Button
          variant='outline'
          onClick={handleReject}
          disabled={isApproving || isRejecting}
          className='flex items-center'
        >
          <AlertCircle className='mr-2 h-4 w-4' />
          {isRejecting ? 'Rejecting...' : 'Reject Application'}
        </Button>

        <Button
          onClick={handleApprove}
          disabled={isApproving || isRejecting}
          className='flex items-center'
        >
          <CheckCircle className='mr-2 h-4 w-4' />
          {isApproving ? 'Approving...' : 'Approve Application'}
        </Button>
      </CardFooter>
    </Card>
  )
}
