'use client'

import { LoadingButton } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { useValidateCaptcha } from '@/hooks/use-validate-captcha'
import { API_ROUTES, BIO_MAX_LENGTH, ROUTES } from '@/lib/constants'
import { creatorApplicationSchema } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { PaymentProvider } from '@prisma/client'
import { User } from 'better-auth'
import { useRouter } from 'next/navigation'
import { FC, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { CreatorApplicationPaymentMethods } from './creator-application-payment-methods'

interface Props {
  user: User
}

export const CreatorApplicationForm: FC<Props> = ({ user }) => {
  const router = useRouter()
  const { validateCaptcha } = useValidateCaptcha()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof creatorApplicationSchema>>({
    resolver: zodResolver(creatorApplicationSchema),
    defaultValues: {
      fullName: user.name,
      email: user.email,
      website: '',
      expertise: '',
      experience: '',
      bio: '',
      assetTypes: '',
      portfolio: '',
      terms: false,
      paymentMethods: [
        {
          provider: PaymentProvider.PAYPAL,
          accountIdentifier: '',
          isDefault: true,
        },
      ],
    },
  })

  async function onSubmit(values: z.infer<typeof creatorApplicationSchema>) {
    if (!user) {
      toast.error('Authentication required', {
        description: 'Please log in to submit your application.',
      })

      router.push(ROUTES.login())
      return
    }

    await validateCaptcha()

    startTransition(async () => {
      try {
        // Submit the creator application
        const response = await fetch(API_ROUTES.creatorsApply(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            userId: user.id,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to submit application')
        }

        toast.success('Application submitted', {
          description:
            "We've received your application and will review it shortly.",
        })

        router.push(ROUTES.creatorsThankYou())
      } catch (error) {
        toast.error('Error', {
          description:
            error instanceof Error
              ? error.message
              : 'Something went wrong. Please try again.',
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder='John Doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder='john@example.com'
                  readOnly
                  className='opacity-50'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='website'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website or Social Media Profile (Optional)</FormLabel>
              <FormControl>
                <Input placeholder='https://yourwebsite.com' {...field} />
              </FormControl>

              <FormDescription>
                Share your personal website, LinkedIn, or other professional
                profile
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid  md:grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='expertise'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area of Expertise</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select your expertise' />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value='prompt-engineering'>
                      Prompt Engineering
                    </SelectItem>

                    <SelectItem value='custom-gpts'>
                      Custom GPTs & AI Agents
                    </SelectItem>

                    <SelectItem value='ai-workflows'>
                      AI Workflow Automation
                    </SelectItem>

                    <SelectItem value='content-creation'>
                      Content Creation
                    </SelectItem>

                    <SelectItem value='data-analysis'>Data Analysis</SelectItem>

                    <SelectItem value='industry-expert'>
                      Industry Expert
                    </SelectItem>

                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='experience'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select your experience level' />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value='beginner'>
                      Beginner (&lt; 1 year)
                    </SelectItem>

                    <SelectItem value='intermediate'>
                      Intermediate (1-3 years)
                    </SelectItem>

                    <SelectItem value='advanced'>
                      Advanced (3-5 years)
                    </SelectItem>
                    <SelectItem value='expert'>Expert (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Tell us about your background, skills, and experience with AI...'
                  maxLength={BIO_MAX_LENGTH}
                  currentLength={field.value.length}
                  className='min-h-[120px]'
                />
              </FormControl>

              <FormDescription>
                This will be displayed on your creator profile
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='assetTypes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What types of AI assets do you plan to sell?
              </FormLabel>

              <FormControl>
                <Textarea
                  placeholder='Describe the AI assets you plan to create and sell on our marketplace...'
                  className='min-h-[120px]'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='portfolio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio or Examples (Optional)</FormLabel>
              <FormControl>
                <Input placeholder='https://yourportfolio.com' {...field} />
              </FormControl>

              <FormDescription>
                Share a link to examples of your work (GitHub, portfolio site,
                etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <CreatorApplicationPaymentMethods form={form} />

        <FormField
          control={form.control}
          name='terms'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>

              <div className='space-y-1 leading-none'>
                <FormLabel>
                  I agree to the Creator Terms and Conditions
                </FormLabel>

                <FormDescription>
                  By checking this box, you agree to our creator terms,
                  including our commission structure and content guidelines.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className='flex justify-center'>
          <LoadingButton
            type='submit'
            size='lg'
            isLoading={isPending}
            disabled={isPending}
          >
            Submit Application
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}
