'use client'

import { generateNewAffiliateCodeAction } from '@/actions/affiliate-codes'
import { RefreshCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useTransition } from 'react'
import { LoadingButton } from './ui/button'
import { toast } from './ui/toast'

interface Props {
  id: string
  isCreatorCode: boolean
}

export const GenerateNewAffiliateCode: FC<Props> = ({ id, isCreatorCode }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = async () => {
    startTransition(async () => {
      const { error } = await generateNewAffiliateCodeAction(id, isCreatorCode)

      if (error) {
        toast.error('Code generation failed', {
          description: error || 'Failed to generate new code',
        })

        return
      }

      router.refresh()
    })
  }

  return (
    <LoadingButton
      isLoading={isPending}
      disabled={isPending}
      onClick={handleClick}
      size='lg'
      className='md:h-auto'
    >
      <RefreshCcw className='w-5 h-5 mr-2' />
      Generate new code
    </LoadingButton>
  )
}
