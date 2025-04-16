'use client'

import { cn } from '@/lib/utils'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ComponentProps, FC, ReactNode } from 'react'

const TooltipProvider = TooltipPrimitive.Provider
const RootTooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipPortal = TooltipPrimitive.Portal

const TooltipContent: FC<ComponentProps<typeof TooltipPrimitive.Content>> = ({
  className,
  sideOffset = 4,
  ref,
  ...props
}) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
)

const Tooltip: FC<{ trigger: ReactNode; content: ReactNode }> = ({
  trigger,
  content,
}) => {
  return (
    <TooltipProvider delayDuration={200}>
      <RootTooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>

        <TooltipPortal>
          <TooltipContent className='bg-primary text-background'>
            <div>{content}</div>
          </TooltipContent>
        </TooltipPortal>
      </RootTooltip>
    </TooltipProvider>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
