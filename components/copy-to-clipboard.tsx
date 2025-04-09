'use client'

import { Copy } from 'lucide-react'
import { FC } from 'react'
import { Button } from './ui/button'
import { toast } from './ui/toast'

export const CopyToClipboard: FC<{ url: string }> = ({ url }) => {
  return (
    <Button
      size='icon'
      variant='outline'
      className='border-0'
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url)

          toast.success('Copied')
        } catch (err) {
          toast.error('Error', {
            description: 'Failed to copy',
          })
        }
      }}
    >
      <span className='sr-only'>Copy</span>
      <Copy className='w-4 h-4' />
    </Button>
  )
}
