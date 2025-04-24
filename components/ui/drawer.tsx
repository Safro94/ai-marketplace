'use client'

import { cn } from '@/lib/utils'
import { ComponentProps, FC, ReactNode } from 'react'
import { DialogProps, Drawer as DrawerPrimitive } from 'vaul'

const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerPortal = DrawerPrimitive.Portal
const DrawerClose = DrawerPrimitive.Close

const DrawerRoot: FC<ComponentProps<typeof DrawerPrimitive.Root>> = ({
  shouldScaleBackground = true,
  ...props
}) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)

const DrawerOverlay: FC<ComponentProps<typeof DrawerPrimitive.Overlay>> = ({
  className,
  ref,
  ...props
}) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    {...props}
  />
)

const DrawerContent: FC<ComponentProps<typeof DrawerPrimitive.Content>> = ({
  className,
  children,
  ref,
  ...props
}) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
        className,
      )}
      {...props}
    >
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
)

const DrawerHeader: FC<ComponentProps<'div'>> = ({ className, ...props }) => (
  <div
    className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
    {...props}
  />
)

const DrawerFooter: FC<ComponentProps<'div'>> = ({ className, ...props }) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
)

const DrawerTitle: FC<ComponentProps<typeof DrawerPrimitive.Title>> = ({
  className,
  ref,
  ...props
}) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
)

const DrawerDescription: FC<
  ComponentProps<typeof DrawerPrimitive.Description>
> = ({ className, ref, ...props }) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
)

const Drawer: FC<DialogProps & { trigger: ReactNode; content: ReactNode }> = ({
  trigger,
  content,
  direction = 'right',
}) => (
  <DrawerRoot direction={direction}>
    <DrawerTrigger asChild>{trigger}</DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay className='fixed inset-0 bg-black/40' />
      <DrawerContent className='bg-white flex flex-col h-full md:w-[500px] left-auto p-4'>
        {content}
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
)

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
}
