import { PageContainer } from '@/components/page-container'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LINKEDIN_URL, SUPPORT_EMAIL, TWITTER_URL } from '@/lib/constants'
import { ExternalLink, Linkedin, Mail, TwitterIcon } from 'lucide-react'

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
                  </div>
                </div>
              </div>

              <div className='pt-4 border-t'>
                <h3 className='font-medium mb-2'>Follow Us</h3>
                <div className='flex space-x-2'>
                  {/* Twitter icon */}
                  <a href={TWITTER_URL} target='_blank' rel='noreferrer'>
                    <TwitterIcon className='w-5 h-5' />
                    <span className='sr-only'>Twitter</span>
                  </a>

                  <a href={LINKEDIN_URL} target='_blank' rel='noreferrer'>
                    <Linkedin className='w-5 h-5 dark:fill-white' />
                    <span className='sr-only'>Linkedin</span>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
