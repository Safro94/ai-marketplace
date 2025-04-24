'use client'

import { toast } from '@/components/ui/toast'
import { FC, useEffect } from 'react'

interface Props {
  error: string
}

export const ErrorToast: FC<Props> = ({ error }) => {
  useEffect(() => {
    toast.error('An error occurred', {
      description: error,
    })
  }, [error])

  return null
}
