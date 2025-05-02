'use client'

import { LoadingButton } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { API_ROUTES, ROUTES } from '@/lib/constants'
import { assetUploadSchema } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { AssetStatus, Category, LicenseType, Prisma } from '@prisma/client'
import DOMPurify from 'isomorphic-dompurify'
import { useRouter } from 'next/navigation'
import { FC, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AssetImageUpload } from '../upload/_components/asset-image-upload'
import { LicensePricing } from '../upload/_components/license-pricing'

type FormData = z.infer<typeof assetUploadSchema>

interface Props {
  categories: Category[]
  initialData?: Prisma.AssetGetPayload<{
    include: {
      assetLicenses: {
        select: {
          licenseId: true
          price: true
        }
      }
    }
  }>
}

export const AssetUploadForm: FC<Props> = ({ categories, initialData }) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(assetUploadSchema),
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title || '',
      description: initialData?.description || '',
      features: initialData?.features.join(',') || '',
      requirements: initialData?.requirements.join(',') || '',
      featuredImage: initialData?.featuredImage || '',
      assetFile: initialData?.assetFile || '',
      galleryImages: initialData?.galleryImages || [],
      licenses: initialData?.assetLicenses || [
        {
          licenseId: LicenseType.STANDARD,
          price: 20,
        },
      ],
      categoryId: initialData?.categoryId || categories?.[0].id,
      slug: initialData?.slug || '',
    },
  })

  const onSubmit = async (values: z.infer<typeof assetUploadSchema>) => {
    if (!values.licenses.length) {
      toast.error('License required', {
        description: 'Please set up at least one license type',
      })

      return
    }

    if (!values.featuredImage) {
      toast.error('Featured image required', {
        description: 'Please upload a featured image for your product',
      })

      return
    }

    if (!values.assetFile) {
      toast.error('Asset file required', {
        description: 'Please upload your product file',
      })

      return
    }

    startTransition(async () => {
      try {
        const body: FormData = {
          ...values,
          description: DOMPurify.sanitize(values.description),
          featuredImage: values.featuredImage,
          galleryImages: values.galleryImages,
          assetFile: values.assetFile,
          features: values.features,
          requirements: values.requirements,
          slug: values.title.toLowerCase().replace(/\s+/g, '-'),
          licenses: values.licenses,
        }

        const response = await fetch(API_ROUTES.assetsUpload(), {
          method: initialData ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })

        if (!response.ok) {
          toast.error('Error', {
            description: `Failed to ${initialData ? 'update' : 'create'} product. Please try again.`,
          })

          return
        }

        const data = await response.json()

        toast.success('Product uploaded successfully', {
          description:
            data.status === AssetStatus.PUBLISHED
              ? 'Your product is now live on the marketplace.'
              : 'Your product has been submitted for review.',
        })

        router.push(ROUTES.creatorDashboardAssets())
      } catch (error) {
        console.error(error)

        toast.error('Error', {
          description: 'Failed to upload product. Please try again.',
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {initialData && (
          <FormField
            control={form.control}
            name='id'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='hidden' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className='space-y-8'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  A clear, descriptive title for your product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='space-y-4'>
            <div>
              <h3 className='text-lg font-medium mb-2'>Product Files</h3>
              <div className='grid md:grid-cols-2 md:items-stretch gap-4'>
                <Card className='grid grid-rows-[max-content_1fr]'>
                  <CardHeader>
                    <CardTitle>Featured Image</CardTitle>
                    <CardDescription>
                      The main image displayed for your product. Tip: use 16 / 9
                      aspect ratio so your image always looks good and make sure
                      to optmize your image for faster loading.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className='flex'>
                    <AssetImageUpload formField='featuredImage' form={form} />
                  </CardContent>
                </Card>

                <Card className='grid grid-rows-[max-content_1fr]'>
                  <CardHeader>
                    <CardTitle>Product File</CardTitle>
                    <CardDescription>
                      The actual product file that buyers will download
                    </CardDescription>
                  </CardHeader>

                  <CardContent className='flex'>
                    <AssetImageUpload formField='assetFile' form={form} />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className='text-lg font-medium mb-2'>Gallery Images</h3>
              <div className='flex flex-col gap-4'>
                <AssetImageUpload formField='galleryImages' form={form} />
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className='min-h-[200px]' />
                </FormControl>

                <FormDescription>
                  Detailed description of your product, its capabilities, and
                  use cases. You can use HTML tags to format your description.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='features'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className='min-h-[100px]'
                    placeholder='Enter each feature on a new line'
                  />
                </FormControl>

                <FormDescription>
                  List the key features of your product, comma separated
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='requirements'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requirements (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className='min-h-[100px]'
                    placeholder='Enter each requirement on a new line'
                  />
                </FormControl>

                <FormDescription>
                  List any requirements or dependencies, comma separated
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-col gap-2'
                    >
                      {categories.map((category) => (
                        <FormItem
                          key={category.id}
                          className='flex items-center gap-2'
                        >
                          <FormControl>
                            <RadioGroupItem value={category.id} />
                          </FormControl>

                          <FormLabel className='font-normal !mt-0'>
                            {category.name}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='mt-6'>
            <h3 className='text-lg font-medium mb-4'>License Options</h3>
            <LicensePricing
              control={form.control}
              setValue={form.setValue}
              errors={form.formState.errors}
            />
          </div>

          <div className='pt-4 flex justify-center'>
            <LoadingButton
              type='submit'
              isLoading={isPending}
              disabled={isPending}
            >
              {initialData ? 'Edit' : 'Upload'} Product
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  )
}
