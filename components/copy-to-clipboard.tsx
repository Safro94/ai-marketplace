'use client'

import { Copy } from 'lucide-react'
import { FC } from 'react'
import { Button } from './ui/button'
import { toast } from './ui/toast'

export const CopyToClipboard: FC<{ data: string }> = ({ data }) => {
  return (
    <Button
      size='icon'
      variant='outline'
      className='w-8 h-8 border-0 absolute right-[4px] top-auto'
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(data)

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
