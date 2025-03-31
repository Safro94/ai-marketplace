import type { OurFileRouter } from '@/app/api/uploadthing/core'
import {
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react'
import { ComponentProps, FC } from 'react'
import { twMerge } from 'tailwind-merge'

export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()

export const UploadFile: FC<
  Omit<ComponentProps<typeof UploadDropzone>, 'endpoint'> & {
    endpoint?: ComponentProps<typeof UploadDropzone>['endpoint']
  }
> = ({ endpoint = 'imageUploader', ...rest }) => (
  <UploadDropzone
    config={{ cn: twMerge, mode: 'auto' }}
    className='ut-button:bg-primary ut-label:text-primary ut-allowed-content:!h-auto'
    endpoint={endpoint}
    {...rest}
  />
)
