import { getServerSession } from '@/lib/session'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const fileRouter = {
  imageUploader: f({
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
    image: {
      //ver tema de galeria y maxFileCount
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const session = await getServerSession()
      // If you throw, the user will not be able to upload
      if (!session?.user) throw new UploadThingError('Unauthorized')

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata }) => {
      // This code RUNS ON YOUR SERVER after upload
      // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof fileRouter
