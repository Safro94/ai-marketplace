import { SocialButtons } from '@/components/social-buttons'

// const formSchema = z
//   .object({
//     name: z.string(),
//     email: z.string().email({ message: 'Please enter a valid email address' }),
//     password: z
//       .string()
//       .min(6, { message: 'Password must be at least 6 characters' }),
//     confirmPassword: z.string(),
//     terms: z.boolean().refine((val) => val === true, {
//       message: 'You must accept the terms and conditions',
//     }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ['confirmPassword'],
//   })

export const SignupForm = () => {
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     name: '',
  //     email: '',
  //     password: '',
  //     confirmPassword: '',
  //     terms: false,
  //   },
  // })

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   setIsLoading(true)

  //   try {
  //     await authClient.signUp.email(
  //       {
  //         email: values.email,
  //         password: values.password,
  //         name: values.name,
  //         role: USER_TYPES.USER,
  //         callbackURL: ROUTES.home(),
  //         banned: false,
  //       },
  //       {
  //         onRequest: () => {
  //           setIsLoading(true)
  //         },
  //         onSuccess: () => {
  //           setIsLoading(false)
  //           toast.success('Success', {
  //             description: 'You have successfully registered.',
  //           })
  //         },
  //         onError: (ctx) => {
  //           toast.error('Error', {
  //             description: ctx.error.message,
  //           })
  //         },
  //       },
  //     )
  //   } catch (error) {
  //     console.error(error)

  //     toast.error('Error', {
  //       description: 'Something went wrong. Please try again.',
  //     })
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <div className='grid gap-6'>
      {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
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

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='••••••••' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='terms'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md p-4'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>
                    I agree to the{' '}
                    <Link
                      href={ROUTES.terms()}
                      className='text-primary underline underline-offset-4'
                    >
                      terms of service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href={ROUTES.privacy()}
                      className='text-primary underline underline-offset-4'
                    >
                      privacy policy
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <LoadingButton
            type='submit'
            className='w-full'
            isLoading={isLoading}
            disabled={isLoading}
          >
            Create Account
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
      </div> */}

      <SocialButtons sign='up' />
    </div>
  )
}
