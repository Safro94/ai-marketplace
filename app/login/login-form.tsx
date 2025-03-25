'use client'

import { Button, LoadingButton } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { authClient } from '@/lib/auth-client'
import { ROUTES } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import googleIcon from '../public/google-icon.svg'

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: ROUTES.home(),
        },
        {
          onRequest: () => {
            setIsLoading(true)
          },
          onSuccess: () => {
            setIsLoading(false)
            toast({
              title: 'Success',
              description: 'You have successfully logged in.',
            })
          },
          onError: (ctx) => {
            toast({
              title: 'Error',
              description: ctx.error.message,
              variant: 'destructive',
            })
          },
        },
      )
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='grid gap-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='name@example.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='••••••••' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton
            isLoading={isLoading}
            type='submit'
            className='w-full'
            disabled={isLoading}
          >
            Sign In
          </LoadingButton>
        </form>
      </Form>

      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>

        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>Or</span>
        </div>
      </div>

      <Button
        variant='outline'
        type='button'
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true)

          const { error } = await authClient.signIn.social({
            provider: 'google',
            callbackURL: ROUTES.home(),
          })

          if (error) {
            toast({
              title: 'Error',
              description: error.message,
              variant: 'destructive',
            })
            return
          }

          setIsLoading(false)

          toast({
            title: 'Success',
            description: 'You have successfully logged in.',
          })
        }}
      >
        <Image
          src={googleIcon}
          width={16}
          height={16}
          alt='Google Icon'
          className='mr-2'
        />
        Sign in with Google
      </Button>
    </div>
  )
}
