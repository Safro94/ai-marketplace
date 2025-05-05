'use client'

import { cn } from '@/lib/utils'
import { Copy } from 'lucide-react'
import { FC } from 'react'
import { Button } from './ui/button'
import { toast } from './ui/toast'

export const CopyToClipboard: FC<{ data: string; className?: string }> = ({
  data,
  className,
}) => {
  return (
    <div className='w-full flex items-center justify-between gap-2 p-2 bg-primary rounded-md'>
      <code
        className={cn(
          'text-xl font-mono font-bold text-white break-all',
          className,
        )}
      >
        {data}
      </code>

      <Button
        size='icon'
        variant='outline'
        className='flex-shrink-0 w-8 h-8 text-white bg-primary hover:text-primary hover:bg-background'
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(data)

            toast.success('Copied')
          } catch {
            toast.error('Error', {
              description: 'Failed to copy',
            })
          }
        }}
      >
        <span className='sr-only'>Copy</span>
        <Copy className='w-4 h-4' />
      </Button>
    </div>
  )
}
