import { Card, CardContent } from '@/components/ui/card'
import { BarChart, DollarSign, Shield } from 'lucide-react'

export const CreatorsBenefitsSection = () => {
  return (
    <section id='benefits' className='py-16 bg-secondary/30'>
      <div className='container'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Why Sell on AIAssets?
          </h2>
          <p className='text-muted-foreground mt-2 max-w-2xl mx-auto'>
            Join a growing community of AI creators and reach customers
            worldwide
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <Card className='bg-background border-border/50'>
            <CardContent className='p-6 flex flex-col items-center text-center'>
              <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                <DollarSign
                  className='h-6 w-6 text-primary'
                  aria-hidden='true'
                />
              </div>
              <h3 className='text-xl font-medium mb-2'>
                Competitive Commission
              </h3>
              <p className='text-muted-foreground'>
                Keep 85% of your sales with our industry-leading commission
                structure.
              </p>
            </CardContent>
          </Card>
          <Card className='bg-background border-border/50'>
            <CardContent className='p-6 flex flex-col items-center text-center'>
              <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                <BarChart className='h-6 w-6 text-primary' aria-hidden='true' />
              </div>
              <h3 className='text-xl font-medium mb-2'>Powerful Analytics</h3>
              <p className='text-muted-foreground'>
                Track your sales, customer engagement, and performance with
                detailed analytics.
              </p>
            </CardContent>
          </Card>
          <Card className='bg-background border-border/50'>
            <CardContent className='p-6 flex flex-col items-center text-center'>
              <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                <Shield className='h-6 w-6 text-primary' aria-hidden='true' />
              </div>
              <h3 className='text-xl font-medium mb-2'>Secure Platform</h3>
              <p className='text-muted-foreground'>
                We handle payments, delivery, and customer support so you can
                focus on creation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
