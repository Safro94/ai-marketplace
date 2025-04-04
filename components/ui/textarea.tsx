import { cn } from '@/lib/utils'
import { ComponentProps, FC } from 'react'

interface Props extends ComponentProps<'textarea'> {
  currentLength?: number
  maxLength?: number
}

const Textarea: FC<Props> = ({
  className,
  currentLength,
  maxLength,
  ref,
  ...props
}) => {
  return (
    <div className='relative'>
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        ref={ref}
        {...props}
      />

      {maxLength && (
        <span className='absolute bottom-1 right-0 text-xs text-slate-400 mr-2'>
          {currentLength} / {maxLength}
        </span>
      )}
    </div>
  )
}

export { Textarea }
