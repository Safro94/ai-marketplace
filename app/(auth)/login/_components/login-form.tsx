import { SocialButtons } from '@/components/social-buttons'

// const formSchema = z.object({
//   email: z.string().email({ message: 'Please enter a valid email address' }),
//   password: z
//     .string()
//     .min(6, { message: 'Password must be at least 6 characters' }),
// })

export const LoginForm = () => {
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     email: '',
  //     password: '',
  //   },
  // })

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   try {
  //     await authClient.signIn.email(
  //       {
  //         email: values.email,
  //         password: values.password,
  //         callbackURL: ROUTES.home(),
  //       },
  //       {
  //         onRequest: () => {
  //           setIsLoading(true)
  //         },
  //         onSuccess: () => {
  //           setIsLoading(false)
  //           toast.success('Success', {
  //             description: 'You have successfully logged in.',
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
  //   }
  // }

  return (
    <div className='grid gap-4'>
      {/* <Form {...form}>
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
      </div> */}

      <SocialButtons sign='in' />
    </div>
  )
}
