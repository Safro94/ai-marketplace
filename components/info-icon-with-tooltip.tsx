import { InfoIcon } from 'lucide-react'
import { FC } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

interface Props {
  content: string
}

export const InfoIconWithTooltip: FC<Props> = ({ content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon className='h-4 w-4 text-primary cursor-pointer' />
        </TooltipTrigger>

        <TooltipContent>
          <div>{content}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
