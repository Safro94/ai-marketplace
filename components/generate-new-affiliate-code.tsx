'use client'

import { generateNewAffiliateCodeAction } from '@/actions/affiliate-codes'
import { useRouter } from 'next/navigation'
import { FC, useTransition } from 'react'
import { LoadingButton } from './ui/button'

interface Props {
  id: string
  isCreatorCode: boolean
}

export const GenerateNewAffiliateCode: FC<Props> = ({ id, isCreatorCode }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = async () => {
    startTransition(async () => {
      await generateNewAffiliateCodeAction(id, isCreatorCode)

      router.refresh()
    })
  }

  return (
    <LoadingButton
      isLoading={isPending}
      disabled={isPending}
      onClick={handleClick}
    >
      Generate new code
    </LoadingButton>
  )
}
