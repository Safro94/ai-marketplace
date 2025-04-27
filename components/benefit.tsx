import { LucideIcon } from 'lucide-react'
import { FC } from 'react'
import { Motion } from './ui/motion'

interface Props {
  icon: LucideIcon
  title: string
  description: string
  delay: number
}

export const Benefit: FC<Props> = ({
  title,
  icon: Icon,
  description,
  delay,
}) => {
  return (
    <Motion
      className='bg-background rounded-lg p-6  border flex items-center gap-4 card-hover'
      variants={{
        hidden: { opacity: 0, x: 50 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.6, delay },
        },
      }}
    >
      <div className='flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
        <Icon className='h-6 w-6 text-primary' aria-hidden='true' />
      </div>

      <div className='grid'>
        <h3 className='text-xl font-semibold mb-2'>{title}</h3>
        <p className='text-muted-foreground'>{description}</p>
      </div>
    </Motion>
  )
}
