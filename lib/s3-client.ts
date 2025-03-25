import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || ''

// Generate a presigned URL for client-side uploads
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600,
) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })

  return getSignedUrl(s3Client, command, { expiresIn })
}

// Generate a presigned URL for downloading/viewing files
export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn = 3600,
) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  return getSignedUrl(s3Client, command, { expiresIn })
}

// Upload a file directly from the server (for smaller files)
export async function uploadFile(
  key: string,
  body: Buffer,
  contentType: string,
) {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    },
  })

  return upload.done()
}

// Generate a unique key for S3 storage
export function generateS3Key(folder: string, fileName: string) {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 10)
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '-')

  return `${folder}/${timestamp}-${randomString}-${sanitizedFileName}`
}
