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
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  website: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  expertise: z
    .string()
    .min(1, { message: 'Please select your area of expertise' }),
  experience: z
    .string()
    .min(1, { message: 'Please select your experience level' }),
  bio: z
    .string()
    .min(50, { message: 'Bio must be at least 50 characters' })
    .max(500, { message: 'Bio cannot exceed 500 characters' }),
  assetTypes: z.string().min(10, {
    message: 'Please describe the types of assets you plan to sell',
  }),
  portfolio: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
})

export const CreatorApplicationForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: session?.user?.email || '',
      website: '',
      expertise: '',
      experience: '',
      bio: '',
      assetTypes: '',
      portfolio: '',
      terms: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to submit your application.',
        variant: 'destructive',
      })
      router.push('/login')
      return
    }

    setIsLoading(true)

    try {
      // Submit the creator application
      const response = await fetch('/api/creators/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          userId: session.user.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit application')
      }

      toast({
        title: 'Application submitted',
        description:
          "We've received your application and will review it shortly.",
      })

      router.push('/creators/thank-you')
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
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
                <Input placeholder='john@example.com' {...field} />
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

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                  placeholder='Tell us about your background, skills, and experience with AI...'
                  className='min-h-[120px]'
                  {...field}
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

        <LoadingButton
          type='submit'
          className='w-full'
          size='lg'
          isLoading={isLoading}
          disabled={isLoading}
        >
          Submit Application
        </LoadingButton>
      </form>
    </Form>
  )
}
