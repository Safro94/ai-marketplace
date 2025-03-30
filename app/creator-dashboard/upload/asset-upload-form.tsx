'use client'

import { LoadingButton } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UploadDropzone } from '@/components/ui/file-upload'
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
import { API_ROUTES, ROUTES } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { AssetStatus } from '@prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import { assetUploadSchema } from './asset-upload-schema'
import { LicensePricing } from './license-pricing'

type FormData = z.infer<typeof assetUploadSchema>

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = [
  // Documents
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  // Code & JSON
  'application/json',
  'text/javascript',
  'text/x-python',
  // Archives
  'application/zip',
  'application/x-zip-compressed',
]

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/gif',
  'image/webp',
]

export default function AssetUploadForm() {
  const [isUploading, setIsUploading] = useState(false)
  // const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  // const [galleryImages, setGalleryImages] = useState<string[]>([])
  // const [assetFile, setAssetFile] = useState<string | null>(null)
  const [licenses, setLicenses] = useState<
    { licenseId: string; price: number }[]
  >([])

  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(assetUploadSchema),
    defaultValues: {
      title: '',
      description: '',
      features: '',
      requirements: '',
      featuredImage: '',
      assetFile: '',
      galleryImages: [],
      licenses: [],
      slug: '',
    },
  })

  const handleAssetFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (file.size > MAX_FILE_SIZE) {
        toast.error('File too large', {
          description: `The file size should not exceed ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB`,
        })
        return
      }

      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast.error('Invalid file type', {
          description: 'Please upload a valid file type',
        })
        return
      }

      // setAssetFile(file)
    }
  }

  const handleFeaturedAndGalleryImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)

      // Validate each file
      const validFiles = files.filter((file) => {
        if (file.size > MAX_IMAGE_SIZE) {
          toast.error('Image too large', {
            description: `Image "${file.name}" exceeds ${
              MAX_IMAGE_SIZE / (1024 * 1024)
            }MB limit`,
          })

          return
        }

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          toast.error('Invalid image type', {
            description: `Image "${file.name}" is not a supported format`,
          })
          return false
        }

        return true
      })

      // if (previewImages.length + validFiles.length > 5) {
      //   toast.error('Too many images', {
      //     description: 'You can upload a maximum of 5 preview images',
      //   })

      //   return
      // }

      // // Create preview URLs
      // const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file))

      // setPreviewImages((prev) => [...prev, ...validFiles])
      // setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  // const removePreviewImage = (index: number) => {
  //   setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  //   setPreviewImageKeys((prev) => prev.filter((_, i) => i !== index))
  // }

  // const removeAssetFile = () => {
  //   setAssetFile(null)
  // }

  const onSubmit = async (values: z.infer<typeof assetUploadSchema>) => {
    console.log(values)
    if (!licenses.length) {
      toast.error('License required', {
        description: 'Please set up at least one license type',
      })

      return
    }

    if (!values.featuredImage) {
      toast.error('Featured image required', {
        description: 'Please upload a featured image for your asset',
      })

      return
    }

    if (!values.assetFile) {
      toast.error('Asset file required', {
        description: 'Please upload your asset file',
      })

      return
    }

    try {
      setIsUploading(true)

      const body: FormData = {
        ...values,
        featuredImage: values.featuredImage,
        galleryImages: values.galleryImages,
        assetFile: values.assetFile,
        features: values.features,
        requirements: values.requirements,
        slug: values.title.toLowerCase().replace(/\s+/g, '-'),
        licenses,
      }

      const response = await fetch(API_ROUTES.assetsUpload(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error('Failed to create asset')

      const data = await response.json()

      toast.success('Asset uploaded successfully', {
        description:
          data.status === AssetStatus.PUBLISHED
            ? 'Your asset is now live on the marketplace.'
            : 'Your asset has been submitted for review.',
      })

      router.push(ROUTES.creatorDashboard())
    } catch (error) {
      console.error(error)

      toast.error('Error', {
        description: 'Failed to upload asset. Please try again.',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
                A clear, descriptive title for your asset
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>Asset Files</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                  <CardDescription>
                    The main image displayed for your asset
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Controller
                    control={form.control}
                    name='featuredImage'
                    render={({ field }) => (
                      <UploadDropzone
                        {...field}
                        config={{ cn: twMerge, mode: 'auto' }}
                        className='ut-button:bg-primary ut-label:text-primary'
                        endpoint='imageUploader'
                        onClientUploadComplete={(res) => {
                          toast.success('File uploaded successfully')
                          form.setValue('featuredImage', res[0].ufsUrl)
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(
                            'An error occurred while uploading your file',
                            {
                              description: error.message,
                            },
                          )
                        }}
                      />
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Asset File</CardTitle>
                  <CardDescription>
                    The actual asset file that buyers will download
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Controller
                    control={form.control}
                    name='assetFile'
                    render={({ field }) => (
                      <UploadDropzone
                        {...field}
                        config={{ cn: twMerge, mode: 'auto' }}
                        className='ut-button:bg-primary ut-label:text-primary'
                        endpoint='imageUploader'
                        onClientUploadComplete={(res) => {
                          toast.success('File uploaded successfully')
                          form.setValue('assetFile', res[0].ufsUrl)
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(
                            'An error occurred while uploading your file',
                            {
                              description: error.message,
                            },
                          )
                        }}
                      />
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-medium mb-2'>Gallery Images</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {form.getValues('galleryImages').map((img, index) => (
                <div
                  key={index}
                  className='relative aspect-video rounded-md overflow-hidden'
                >
                  <Image
                    layout='fill'
                    objectFit='cover'
                    src={img || '/placeholder.svg'}
                    alt={`Gallery ${index + 1}`}
                    className='w-full h-full'
                  />
                </div>
              ))}

              <Input
                type='file'
                // variant='outline'
                onChange={handleFeaturedAndGalleryImageUpload}
                className='flex items-center justify-center gap-2 w-fit'
              />
              {/* <Upload className='h-4 w-4' />
                Add Image
              </Input> */}
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
                Detailed description of your asset, its capabilities, and use
                cases
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Controller
          control={form.control}
          name='features'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Enter each feature on a new line'
                />
              </FormControl>

              <FormDescription>
                List the key features of your asset, comma separated
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

        <div className='mt-6'>
          <h3 className='text-lg font-medium mb-4'>License Options</h3>
          <LicensePricing basePrice={20} onChange={setLicenses} />
        </div>

        <div className='pt-4 flex justify-end'>
          <LoadingButton
            isLoading={isUploading}
            type='submit'
            disabled={isUploading}
          >
            Upload Asset
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}
