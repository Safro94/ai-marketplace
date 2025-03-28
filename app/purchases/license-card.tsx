import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ROUTES } from '@/lib/constants'
import { format } from 'date-fns'
import { Download, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

interface Props {
  purchase: {
    id: string
    createdAt: Date
    licenseKey: string | null
    amount: number
    asset: {
      title: string
      slug: string
      assetFile: string
    }
    assetLicense: {
      license: {
        name: string
        features: string[]
      }
    } | null
  }
}

export const LicenseCard: FC<Props> = ({ purchase }) => {
  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle>{purchase.asset.title}</CardTitle>
            <CardDescription>
              {purchase.assetLicense?.license.name} • Purchased on{' '}
              {format(new Date(purchase.createdAt), 'PPP')}
            </CardDescription>
          </div>

          <div className='text-right'>
            <span className='text-sm text-muted-foreground'>License Key</span>
            <p className='font-mono text-xs bg-muted p-1 rounded mt-1'>
              {purchase.licenseKey}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className='space-y-2'>
          <h4 className='text-sm font-medium'>License Features:</h4>
          <ul className='space-y-1'>
            {purchase.assetLicense?.license.features.map((feature, index) => (
              <li key={index} className='text-sm'>
                • {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className='flex justify-between'>
        <Button variant='outline' size='sm' asChild>
          <Link href={`${ROUTES.assets()}/${purchase.asset.slug}`}>
            <ExternalLink className='h-4 w-4 mr-2' />
            View Asset
          </Link>
        </Button>

        <Button size='sm' asChild>
          <Link href={purchase.asset.assetFile}>
            <Download className='h-4 w-4 mr-2' />
            Download
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
