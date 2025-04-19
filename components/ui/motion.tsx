'use client'

import { motion, MotionProps } from 'motion/react'
import { JSX } from 'react'

interface Props<Tag extends keyof JSX.IntrinsicElements> extends MotionProps {
  type?: Tag
  className?: string
}

export const Motion = <Tag extends keyof JSX.IntrinsicElements>({
  type,
  children,
  className,
  ...props
}: Props<Tag>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = type ? (motion as any)[type] : motion.div

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}
