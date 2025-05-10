import { getServerSession } from '@/lib/session'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

const auth = async () => {
  // This code runs on your server before upload
  const session = await getServerSession()
  // If you throw, the user will not be able to upload
  if (!session?.user) throw new UploadThingError('Unauthorized')

  return {}
}

export const fileRouter = {
  assetUploadFeaturedImageOrVideo: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => await auth())
    .onUploadComplete(() => {
      // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {}
    }),

  assetUploadGalleryImages: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 3,
    },
  })
    .middleware(async () => await auth())
    .onUploadComplete(() => {
      // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {}
    }),

  assetUploadFile: f({
    'application/json': {
      maxFileCount: 1,
      maxFileSize: '4MB',
    },
    'application/zip': {
      maxFileCount: 1,
      maxFileSize: '4MB',
    },
    'application/gzip': {
      maxFileCount: 1,
      maxFileSize: '4MB',
    },
    'application/pdf': {
      maxFileCount: 1,
      maxFileSize: '4MB',
    },
    'text/plain': {
      maxFileCount: 1,
      maxFileSize: '4MB',
    },
    'text/markdown': {
      maxFileCount: 1,
      maxFileSize: '4MB',
    },
    //@ts-expect-error types not typed in the lib
    'application/x-zip-compressed': {
      maxFileCount: 1,
      maxFileSize: '4MB',
    },
    'text/x-python': {
      maxFileCount: 1,
      maxFileSize: '4MB',
    },
    'text/javascript': {
      maxFileCount: 1,
      maxFileSize: '4MB',
    },
  })
    .middleware(async () => await auth())
    .onUploadComplete(() => {
      // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {}
    }),
} satisfies FileRouter

export type OurFileRouter = typeof fileRouter
