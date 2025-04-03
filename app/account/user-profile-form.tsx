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
import { API_ROUTES } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  bio: z
    .string()
    .max(500, { message: 'Bio cannot exceed 500 characters' })
    .optional(),
})

interface UserProfileFormProps {
  initialData: {
    name: string
    email: string
    bio?: string
    avatarUrl?: string
  }
}

export default function UserProfileForm({ initialData }: UserProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      bio: initialData.bio || '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
        <CardDescription>
          Update your profile information and avatar
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className='space-y-6'>
            <div className='flex flex-col items-center space-y-4'>
              <Avatar className='h-24 w-24'>
                <AvatarImage
                  src={initialData.avatarUrl}
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
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder='Tell us a bit about yourself...'
                        className='min-h-[120px]'
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
