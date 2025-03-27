import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

export const NotFound = ({
  title,
  description,
  btnLink,
  btnText,
  icon: Icon,
}: {
  title: string
  description: string
  btnLink?: string
  btnText?: string
  icon: LucideIcon
}) => (
  <Card>
    <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
      <Icon className='h-12 w-12 text-muted-foreground mb-4' />

      <h3 className='text-lg font-medium mb-2'>{title}</h3>
      <p className='text-muted-foreground max-w-md mb-6'>{description}</p>

      {btnLink && btnText && (
        <Button asChild>
          <Link href={btnLink}>{btnText}</Link>
        </Button>
      )}
    </CardContent>
  </Card>
)
