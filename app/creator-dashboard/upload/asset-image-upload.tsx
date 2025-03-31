'use client'

import { Button } from '@/components/ui/button'
import { UploadFile } from '@/components/ui/file-upload'
import { FormMessage } from '@/components/ui/form'
import { toast } from '@/components/ui/toast'
import Image from 'next/image'
import { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { assetUploadSchema } from './asset-upload-schema'

type FormData = z.infer<typeof assetUploadSchema>

interface Props {
  form: ReturnType<typeof useForm<FormData>>
  formField: keyof Pick<
    FormData,
    'featuredImage' | 'assetFile' | 'galleryImages'
  >
}

export const AssetImageUpload: FC<Props> = ({ form, formField }) => {
  const isGallery = formField === 'galleryImages'

  const renderComponent = () => {
    switch (true) {
      case isGallery:
        return (
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2'>
              {form.getValues('galleryImages').map((item) => (
                <Image
                  key={item}
                  width={150}
                  height={150}
                  src={item}
                  alt='Image'
                  className='object-cover mt-2 rounded-md'
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
          <div className='flex flex-col gap-2'>
            <Image
              width={150}
              height={150}
              src={form.getValues('featuredImage')}
              alt='Featured Image'
              className='w-full h-full object-cover mt-2 rounded-md'
            />

            <Button
              type='button'
              variant='outline'
              onClick={() => {
                form.setValue('featuredImage', '', {
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
          <div className='flex flex-col gap-2 h-full'>
            <span className='text-2xl font-medium h-full w-full flex flex-col gap-4 justify-center items-center border rounded-lg bg-gray-100'>
              Preview not available
            </span>

            <Button
              type='button'
              variant='outline'
              onClick={() => {
                form.setValue('assetFile', '', {
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
    ? !!form.getValues(formField).length
    : form.getValues(formField)

  return (
    <>
      {showImages ? (
        renderComponent()
      ) : (
        <Controller
          control={form.control}
          name={formField}
          render={({ field }) => (
            <div className='flex flex-col gap-2'>
              <UploadFile
                {...field}
                onClientUploadComplete={(res) => {
                  toast.success('File uploaded successfully')

                  if (isGallery) {
                    form.setValue(
                      formField,
                      res.map((item) => item.ufsUrl),
                    )
                  } else {
                    form.setValue(formField, res[0].ufsUrl)
                  }
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
          )}
        />
      )}
    </>
  )
}
