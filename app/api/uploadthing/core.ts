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
    'application/zip': {},
    'application/gzip': {},
    'application/pdf': {},
    'text/plain': {},
    'text/markdown': {},
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      {},
    //@ts-expect-error types not typed in the lib
    'application/x-zip-compressed': {},
    'text/x-python': {},
    'text/javascript': {},
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
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
