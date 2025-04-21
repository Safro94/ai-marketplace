'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoadingButton } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { API_ROUTES, BIO_MAX_LENGTH } from '@/lib/constants'
import { userAccountSchema } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Profile } from '@prisma/client'
import { User } from 'better-auth'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

interface Props {
  initialData: Pick<
    Profile,
    'bio' | 'twitterHandle' | 'githubHandle' | 'website'
  > &
    Pick<User, 'email' | 'image' | 'name'>
}

export const UserProfileForm: FC<Props> = ({ initialData }) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof userAccountSchema>>({
    resolver: zodResolver(userAccountSchema),
    defaultValues: {
      name: initialData.name,
      bio: initialData.bio || '',
      website: initialData.website || '',
      githubHandle: initialData.githubHandle || '',
      twitterHandle: initialData.twitterHandle || '',
    },
  })

  const onSubmit = async (values: z.infer<typeof userAccountSchema>) => {
    setIsLoading(true)

    try {
      const response = await fetch(`${API_ROUTES.userProfile()}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      toast.success('Profile updated', {
        description: 'Your profile has been updated successfully.',
      })

      router.refresh()
    } catch (error) {
      toast.error('Error', {
        description:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className='space-y-6'>
            <div className='flex flex-col items-center space-y-4'>
              <Avatar className='h-24 w-24'>
                <AvatarImage
                  src={initialData.image || ''}
                  alt={initialData.name}
                />
                <AvatarFallback>
                  {initialData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Your name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='space-y-2'>
                <FormLabel>Email</FormLabel>
                <Input value={initialData.email} disabled />
                <p className='text-sm text-muted-foreground'>
                  Your email address is associated with your account and cannot
                  be changed.
                </p>
              </div>

              <FormField
                control={form.control}
                name='website'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder='https://yourwebsite.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='githubHandle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Handle (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder='your-github-handle' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='twitterHandle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Handle (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder='your-twitter-handle' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio (Optional)</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder='Tell us a bit about yourself...'
                        className='min-h-[120px]'
                        maxLength={BIO_MAX_LENGTH}
                        currentLength={field.value?.length}
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      This will be displayed on your public profile
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter>
            <LoadingButton
              isLoading={isLoading}
              type='submit'
              className='ml-auto'
              disabled={isLoading}
            >
              Save Changes
            </LoadingButton>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
