'use client'

import { Button } from '@/components/ui/button'
import { UploadDropzone, UploadFile } from '@/components/ui/file-upload'
import { FormMessage } from '@/components/ui/form'
import { toast } from '@/components/ui/toast'
import { assetUploadSchema } from '@/lib/schemas'
import { cn, createDownloadLink } from '@/lib/utils'
import Image from 'next/image'
import { ComponentProps, FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

type FormData = z.infer<typeof assetUploadSchema>
type ImageSchemaKeys = keyof Pick<
  FormData,
  'featuredImage' | 'assetFile' | 'galleryImages'
>

interface Props {
  form: ReturnType<typeof useForm<FormData>>
  formField: ImageSchemaKeys
}

export const AssetImageUpload: FC<Props> = ({ form, formField }) => {
  const isGallery = formField === 'galleryImages'

  const renderComponent = () => {
    switch (true) {
      case isGallery:
        return (
          <div className='flex flex-col gap-2 flex-1'>
            <div className='flex flex-wrap gap-2'>
              {form
                .getValues('galleryImages')
                ?.map((item, i) => (
                  <Image
                    key={item + i}
                    priority
                    src={item}
                    alt='Image'
                    width={150}
                    height={150}
                    className='object-fill rounded-lg'
                  />
                ))}
            </div>

            <Button
              type='button'
              variant='outline'
              onClick={() => {
                form.setValue('galleryImages', [], {
                  shouldValidate: true,
                })
              }}
            >
              Replace images
            </Button>
          </div>
        )
      case formField === 'featuredImage':
        return (
          <div className='flex flex-col gap-2 flex-1'>
            <Image
              width={150}
              height={150}
              src={form.getValues(formField)}
              alt='Featured Image'
              className='w-full h-[400px] object-fill rounded-lg'
              priority
            />

            <Button
              type='button'
              variant='outline'
              onClick={() => {
                form.setValue(formField, '', {
                  shouldValidate: true,
                })
              }}
            >
              Replace image
            </Button>
          </div>
        )
      default:
        return (
          <div className='flex flex-col gap-2 h-full flex-1 justify-end'>
            <span className='text-2xl font-medium h-[250px] lg:!h-[400px] w-full flex flex-col gap-4 justify-center items-center border rounded-lg bg-gray-100'>
              Preview not available
              <Button
                type='button'
                onClick={async (e) => {
                  e.preventDefault()

                  try {
                    const response = await fetch(form.getValues('assetFile'))

                    if (!response.ok) {
                      toast.error('Error', {
                        description: 'Failed to download your file',
                      })
                      return
                    }

                    const file = await response.blob()
                    const fileName = form.getValues('title') || 'Asset file'

                    createDownloadLink(file, fileName)
                  } catch (e) {
                    console.error(e)
                    toast.error('Error', {
                      description: 'Failed to download your file',
                    })
                  }
                }}
              >
                Download file
              </Button>
            </span>

            <Button
              type='button'
              variant='outline'
              onClick={() => {
                form.setValue(formField, '', {
                  shouldValidate: true,
                })
              }}
            >
              Replace file
            </Button>
          </div>
        )
    }
  }

  const showImages = Array.isArray(form.getValues(formField))
    ? !!form.getValues(formField)?.length
    : form.getValues(formField)

  return (
    <>
      {showImages ? (
        renderComponent()
      ) : (
        <Controller
          control={form.control}
          name={formField}
          render={() => {
            const endpoints: Record<
              ImageSchemaKeys,
              ComponentProps<typeof UploadDropzone>['endpoint']
            > = {
              featuredImage: 'assetUploadFeaturedImageOrVideo',
              assetFile: 'assetUploadFile',
              galleryImages: 'assetUploadGalleryImages',
            }

            const endpoint = endpoints[formField]

            return (
              <div
                className={cn(
                  'flex-1 flex',
                  form.formState.errors[formField] && 'flex flex-col gap-2',
                )}
              >
                <UploadFile
                  endpoint={endpoint}
                  onClientUploadComplete={(res) => {
                    if (isGallery) {
                      form.setValue(
                        formField,
                        res.map((item) => item.ufsUrl),
                        { shouldValidate: true },
                      )
                    } else {
                      form.setValue(formField, res[0].ufsUrl, {
                        shouldValidate: true,
                      })
                    }

                    toast.success('File uploaded successfully')
                  }}
                  onUploadError={(error: Error) => {
                    toast.error('An error occurred while uploading your file', {
                      description: error.message,
                    })
                  }}
                />

                {/* @ts-expect-error error */}
                <FormMessage error={form.formState.errors[formField]} />
              </div>
            )
          }}
        />
      )}
    </>
  )
}
