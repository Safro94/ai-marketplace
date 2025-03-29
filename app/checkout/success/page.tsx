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
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <div className='container py-10'>
      <div className='max-w-md mx-auto'>
        <Card>
          <CardHeader className='text-center'>
            <div className='mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4'>
              <CheckCircle className='h-6 w-6 text-green-600' />
            </div>

            <CardTitle className='text-2xl'>Purchase Successful!</CardTitle>
            <CardDescription>
              Thank you for your purchase. Your assets are now available in your
              account.
            </CardDescription>
          </CardHeader>

          <CardContent className='text-center'>
            <p className='text-muted-foreground'>
              You can download your purchased assets from your purchases page.
              License keys have been generated for each asset.
            </p>
          </CardContent>

          <CardFooter className='flex justify-center space-x-4'>
            <Button asChild variant='outline'>
              <Link href={ROUTES.explore()}>Continue Shopping</Link>
            </Button>

            <Button asChild>
              <Link href={ROUTES.purchases()}>View Purchases</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
