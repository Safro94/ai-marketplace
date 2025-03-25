import prisma from '@/lib/prisma'
import { generatePresignedUploadUrl, generateS3Key } from '@/lib/s3-client'
import { getServerSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { fileName, contentType, fileType } = await request.json()

    if (!fileName || !contentType || !fileType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Check if user is a creator
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile?.isCreator) {
      return NextResponse.json(
        { error: 'Only creators can upload files' },
        { status: 403 },
      )
    }

    // Determine folder based on file type
    let folder = 'assets'
    if (fileType === 'image') {
      folder = 'images'
    } else if (fileType === 'preview') {
      folder = 'previews'
    }

    // Generate a unique key for the file
    const key = generateS3Key(folder, fileName)

    // Generate presigned URL
    const presignedUrl = await generatePresignedUploadUrl(key, contentType)

    return NextResponse.json({
      presignedUrl,
      key,
      url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 },
    )
  }
}
