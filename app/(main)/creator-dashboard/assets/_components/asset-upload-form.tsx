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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { useBeforePageUnload } from '@/hooks/use-before-page-unload'
import { API_ROUTES, ROUTES } from '@/lib/constants'
import { assetUploadSchema } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AssetStatus,
  Category,
  LicenseType,
  PrimaryMediaType,
  Prisma,
} from '@prisma/client'
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
  useBeforePageUnload(isPending ? false : true)

  const form = useForm<FormData>({
    resolver: zodResolver(assetUploadSchema),
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title || '',
      description: initialData?.description || '',
      features: initialData?.features.join(',') || '',
      requirements: initialData?.requirements.join(',') || '',
      featuredImage: initialData?.featuredImage || '',
      primaryMediaType: initialData?.primaryMediaType || PrimaryMediaType.IMAGE,
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

        startTransition(() => {
          router.push(ROUTES.creatorDashboardAssets())
        })
      } catch (error) {
        console.error(error)

        toast.error('Error', {
          description: 'Failed to upload product. Please try again.',
        })
      }
    })
  }

  const getPrimaryMediaCopy = () => {
    switch (watchedPrimaryMediaType) {
      case PrimaryMediaType.IMAGE:
        return (
          <div>
            The main image displayed for your product. This is what customers
            will see first.
            <ul className='list-disc px-4'>
              <li>Use 16:9 aspect ratio for optimal display across devices</li>
              <li>
                Optimize your image for faster loading (under 2MB recommended)
              </li>
              <li>High-quality, well-lit photos increase conversion rates</li>
            </ul>
          </div>
        )
      case PrimaryMediaType.VIDEO:
        return (
          <div>
            The featured video showcasing your product in action.
            <ul className='list-disc px-4'>
              <li>Keep videos under 30 seconds for best engagement</li>
              <li>Use 16:9 aspect ratio for consistent display</li>
              <li>Include captions as many viewers watch without sound</li>
            </ul>
          </div>
        )

      default:
        return null
    }
  }

  const handleTabClick = (tab: PrimaryMediaType) => {
    form.setValue('primaryMediaType', tab)
    form.setValue('featuredImage', '')
  }

  const watchedPrimaryMediaType = form.watch('primaryMediaType')

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
              <div className='grid lg:grid-cols-2 lg:items-stretch gap-4'>
                <Card className='grid grid-rows-[max-content_1fr]'>
                  <CardHeader>
                    <CardTitle>Primary Media</CardTitle>
                    <CardDescription>{getPrimaryMediaCopy()}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <Tabs defaultValue={form.getValues('primaryMediaType')}>
                      <TabsList>
                        <TabsTrigger
                          value={PrimaryMediaType.IMAGE}
                          onClick={() => handleTabClick(PrimaryMediaType.IMAGE)}
                        >
                          Image
                        </TabsTrigger>

                        <TabsTrigger
                          value={PrimaryMediaType.VIDEO}
                          onClick={() => handleTabClick(PrimaryMediaType.VIDEO)}
                        >
                          Video
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value={PrimaryMediaType.IMAGE}>
                        <AssetImageUpload
                          formField='featuredImage'
                          form={form}
                        />
                      </TabsContent>

                      <TabsContent value={PrimaryMediaType.VIDEO}>
                        <FormField
                          control={form.control}
                          name='featuredImage'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Video URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>

                              <FormDescription>
                                Please provide the embed URL for your video
                                (e.g., YouTube, Vimeo). Note: Regular video URLs
                                (e.g., https://www.youtube.com/watch?v=example)
                                will not work. Use the embed format instead
                                (e.g., https://www.youtube.com/embed/example).
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card className='grid grid-rows-[max-content_1fr]'>
                  <CardHeader>
                    <CardTitle>Product File</CardTitle>
                    <CardDescription>
                      This downloadable file contains all the necessary
                      components of your AI product. After purchase, buyers will
                      receive either this single file or a zip folder containing
                      all required elements. Important: Please ensure your file
                      includes clear setup and usage instructions.
                      Well-documented products receive higher ratings and fewer
                      support requests. Consider including: A README file with
                      clear instructions | Configuration guides and exampless |
                      Troubleshooting tips for common issues | Links to
                      resources | Contact information for support questions
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
                  use cases. Please describe what the buyer will get after they
                  purchase your product. Use HTML tags for formatting, if you
                  don&apos;t, the text will be displayed as plain text.
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
                <FormLabel>Features (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className='min-h-[100px]'
                    placeholder='Enter each feature, comma separated'
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
                    placeholder='Enter each requirement, comma separated'
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
