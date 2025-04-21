import { PageContainer } from '@/components/page-container'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { INFO_EMAIL, SUPPORT_EMAIL } from '@/lib/constants'
import { ExternalLink, Mail } from 'lucide-react'

export default function ContactPage() {
  return (
    <PageContainer>
      <div className='max-w-2xl mx-auto'>
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-bold mb-4'>Contact Us</h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Have questions or feedback? We&apos;d love to hear from you. Fill
            out the form below or reach out to us directly.
          </p>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Reach out to us directly through these channels.
              </CardDescription>
            </CardHeader>

            <CardContent className='space-y-6'>
              <div className='flex items-start space-x-3'>
                <Mail className='h-5 w-5 text-primary mt-0.5' />

                <div>
                  <h3 className='font-medium'>Email</h3>

                  <div className='flex flex-col'>
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className='text-sm text-muted-foreground flex items-center gap-2'
                    >
                      {SUPPORT_EMAIL} <ExternalLink className='w-4 h-4' />
                    </a>

                    <a
                      href={`mailto:${INFO_EMAIL}`}
                      className='text-sm text-muted-foreground flex items-center gap-2'
                    >
                      {INFO_EMAIL} <ExternalLink className='w-4 h-4' />
                    </a>
                  </div>
                </div>
              </div>

              <div className='pt-4 border-t'>
                <h3 className='font-medium mb-2'>Follow Us</h3>
                <div className='flex space-x-2'>
                  {/* Twitter icon */}
                  <Button variant='outline' size='icon'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-twitter'
                    >
                      <path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' />
                    </svg>
                  </Button>

                  {/* Linkedin Icon */}
                  <Button variant='outline' size='icon'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='lucide lucide-linkedin'
                    >
                      <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
                      <rect width='4' height='12' x='2' y='9' />
                      <circle cx='4' cy='4' r='2' />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
