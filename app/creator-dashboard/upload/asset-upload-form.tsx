'use client'

import type React from 'react'

import { useSupabase } from '@/app/supabase-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, ImageIcon, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

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

const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters' })
    .max(100),
  description: z
    .string()
    .min(20, { message: 'Description must be at least 20 characters' })
    .max(500),
  longDescription: z.string().min(100, {
    message: 'Detailed description must be at least 100 characters',
  }),
  price: z.coerce
    .number()
    .min(1, { message: 'Price must be at least $1' })
    .max(1000),
  category: z.string().min(1, { message: 'Please select a category' }),
  useCase: z.string().min(1, { message: 'Please select a use case' }),
  features: z.string().min(10, { message: 'Please list at least one feature' }),
  requirements: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
})

export default function AssetUploadForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [assetFile, setAssetFile] = useState<File | null>(null)
  const [previewImages, setPreviewImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const { user } = useSupabase()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      longDescription: '',
      price: 0,
      category: '',
      useCase: '',
      features: '',
      requirements: '',
      terms: false,
    },
  })

  const handleAssetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'File too large',
          description: `The file size should not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
          variant: 'destructive',
        })
        return
      }

      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a valid file type',
          variant: 'destructive',
        })
        return
      }

      setAssetFile(file)
    }
  }

  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)

      // Validate each file
      const validFiles = files.filter((file) => {
        if (file.size > MAX_IMAGE_SIZE) {
          toast({
            title: 'Image too large',
            description: `Image "${file.name}" exceeds ${MAX_IMAGE_SIZE / (1024 * 1024)}MB limit`,
            variant: 'destructive',
          })
          return false
        }

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          toast({
            title: 'Invalid image type',
            description: `Image "${file.name}" is not a supported format`,
            variant: 'destructive',
          })
          return false
        }

        return true
      })

      if (previewImages.length + validFiles.length > 5) {
        toast({
          title: 'Too many images',
          description: 'You can upload a maximum of 5 preview images',
          variant: 'destructive',
        })
        return
      }

      // Create preview URLs
      const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file))

      setPreviewImages((prev) => [...prev, ...validFiles])
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const removePreviewImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index])
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const removeAssetFile = () => {
    setAssetFile(null)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to upload assets',
        variant: 'destructive',
      })
      router.push('/login')
      return
    }

    if (!assetFile) {
      toast({
        title: 'Asset file required',
        description: 'Please upload your asset file',
        variant: 'destructive',
      })
      return
    }

    if (previewImages.length === 0) {
      toast({
        title: 'Preview images required',
        description: 'Please upload at least one preview image',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      // This would be a real API call in production
      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: 'Asset submitted',
        description: 'Your asset has been submitted for review',
      })

      router.push('/creator-dashboard')
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='space-y-8'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g., Advanced SEO Content Generation System'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear, descriptive title for your asset
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='A brief description of your asset (appears in search results and listings)'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    100-500 characters that summarize your asset
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='prompt-engineering'>
                          Prompt Engineering Systems
                        </SelectItem>
                        <SelectItem value='custom-gpts'>
                          Custom GPTs & AI Agents
                        </SelectItem>
                        <SelectItem value='ai-workflows'>
                          AI Workflow Automations
                        </SelectItem>
                        <SelectItem value='industry-solutions'>
                          Industry-Specific Solutions
                        </SelectItem>
                        <SelectItem value='content-templates'>
                          Content Creation Templates
                        </SelectItem>
                        <SelectItem value='data-tools'>
                          Data Analysis Tools
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='useCase'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Use Case</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select use case' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='content-creation'>
                          Content Creation
                        </SelectItem>
                        <SelectItem value='data-analysis'>
                          Data Analysis
                        </SelectItem>
                        <SelectItem value='customer-support'>
                          Customer Support
                        </SelectItem>
                        <SelectItem value='marketing'>Marketing</SelectItem>
                        <SelectItem value='sales'>Sales</SelectItem>
                        <SelectItem value='product-development'>
                          Product Development
                        </SelectItem>
                        <SelectItem value='research'>Research</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <span className='absolute left-3 top-2.5 text-muted-foreground'>
                        $
                      </span>
                      <Input
                        type='number'
                        min='0'
                        step='0.01'
                        className='pl-7'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Set a competitive price for your asset (minimum $1)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='space-y-8'>
            {/* Asset File Upload */}
            <div>
              <FormLabel className='block mb-2'>Asset File</FormLabel>
              <div className='border-2 border-dashed border-border rounded-lg p-6 text-center'>
                {!assetFile ? (
                  <>
                    <Upload className='h-10 w-10 text-muted-foreground mx-auto mb-4' />
                    <p className='text-sm text-muted-foreground mb-2'>
                      Upload your asset file (PDF, DOCX, JSON, ZIP, etc.)
                    </p>
                    <p className='text-xs text-muted-foreground mb-4'>
                      Max file size: 50MB
                    </p>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        document.getElementById('asset-file-input')?.click()
                      }
                    >
                      Select File
                    </Button>
                    <Input
                      id='asset-file-input'
                      type='file'
                      className='hidden'
                      onChange={handleAssetFileChange}
                    />
                  </>
                ) : (
                  <div className='flex items-center justify-between bg-secondary/50 rounded-md p-3'>
                    <div className='flex items-center'>
                      <FileText className='h-8 w-8 text-primary mr-3' />
                      <div className='text-left'>
                        <p className='text-sm font-medium truncate max-w-[200px]'>
                          {assetFile.name}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {(assetFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={removeAssetFile}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Images Upload */}
            <div>
              <FormLabel className='block mb-2'>Preview Images</FormLabel>
              <div className='border-2 border-dashed border-border rounded-lg p-6 text-center'>
                <div className='mb-4'>
                  <ImageIcon className='h-10 w-10 text-muted-foreground mx-auto mb-4' />
                  <p className='text-sm text-muted-foreground mb-2'>
                    Upload preview images of your asset (up to 5)
                  </p>
                  <p className='text-xs text-muted-foreground mb-4'>
                    Max file size: 5MB per image
                  </p>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      document.getElementById('preview-image-input')?.click()
                    }
                  >
                    Select Images
                  </Button>
                  <Input
                    id='preview-image-input'
                    type='file'
                    className='hidden'
                    multiple
                    accept='image/*'
                    onChange={handlePreviewImageChange}
                  />
                </div>

                {previewUrls.length > 0 && (
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
                    {previewUrls.map((url, index) => (
                      <div key={index} className='relative group'>
                        <div className='relative aspect-[4/3] w-full overflow-hidden rounded-md'>
                          <Image
                            src={url || '/placeholder.svg'}
                            alt={`Preview ${index + 1}`}
                            fill
                            className='object-cover'
                          />
                        </div>
                        <Button
                          type='button'
                          variant='destructive'
                          size='icon'
                          className='absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                          onClick={() => removePreviewImage(index)}
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className='p-6'>
            <FormField
              control={form.control}
              name='longDescription'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Provide a comprehensive description of your asset, including what it does, how it works, and its benefits...'
                      className='min-h-[200px]'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can use markdown formatting for headings, lists, and
                    emphasis
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <FormField
            control={form.control}
            name='features'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='List the key features of your asset, one per line'
                    className='min-h-[120px]'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  What makes your asset valuable? List each feature on a new
                  line.
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
                    placeholder='List any requirements or prerequisites for using your asset, one per line'
                    className='min-h-[120px]'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Do users need specific software, accounts, or knowledge?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                <FormLabel>I agree to the Asset Submission Terms</FormLabel>
                <FormDescription>
                  By checking this box, you confirm that this asset is your
                  original work or you have the rights to sell it, and you agree
                  to our marketplace terms.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full' size='lg' disabled={isLoading}>
          {isLoading ? (
            <span className='flex items-center'>
              <svg
                className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Submitting Asset...
            </span>
          ) : (
            'Submit Asset for Review'
          )}
        </Button>
      </form>
    </Form>
  )
}
