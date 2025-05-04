import { Check } from 'lucide-react'
import { FC } from 'react'

interface Props {
  title: string
  description: string
  thresholdLabel: string
  benefitLabel: string
  thresholds: number[]
  benefits: string[]
  prefix?: string
}

export const BenefitTiers: FC<Props> = ({
  title,
  description,
  thresholdLabel,
  benefitLabel,
  thresholds,
  benefits,
  prefix = '',
}) => {
  return (
    <div className='bg-background border text-center dark:text-primary-foreground rounded-xl shadow-md overflow-hidden'>
      <div className='bg-primary text-white p-6'>
        <h3 className='text-2xl font-bold mb-2'>{title}</h3>
        <p className='opacity-90'>{description}</p>
      </div>

      <div className='p-6'>
        <div className='grid grid-cols-2 gap-4 mb-4 font-semibold'>
          <div>{thresholdLabel}</div>
          <div>{benefitLabel}</div>
        </div>

        {thresholds.map((threshold, index) => (
          <div
            key={index}
            className={`grid grid-cols-2 gap-4 py-3 ${index !== thresholds.length - 1 ? 'border-b' : ''}`}
          >
            <div className='flex items-center justify-center'>
              <Check className='h-5 w-5 text-primary mr-2' />

              <span>
                {prefix}
                {threshold}
              </span>
            </div>

            <div className='font-semibold'>{benefits[index]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
