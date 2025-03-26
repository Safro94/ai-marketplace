'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { FileText, ImageIcon, Upload, X } from 'lucide-react'
import { FC, useState } from 'react'
import { toast } from './ui/toast'

interface Props {
  onUploadComplete: (url: string, key: string) => void
  onUploadError: (error: string) => void
  fileType: 'asset' | 'image' | 'preview'
  accept?: string
  maxSize?: number // in bytes
}

export const FileUpload: FC<Props> = ({
  onUploadComplete,
  onUploadError,
  fileType,
  accept = '*/*',
  maxSize = 50 * 1024 * 1024, // 50MB default
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]

    // Validate file size
    if (file.size > maxSize) {
      toast.error('File too large', {
        description: `The file size should not exceed ${maxSize / (1024 * 1024)}MB`,
      })

      return
    }

    setFileName(file.name)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Get presigned URL from our API
      const response = await fetch('/api/uploads/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          fileType,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get upload URL')
      }

      const { presignedUrl, key, url } = await response.json()

      // Upload file directly to S3 using the presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      // Call the onUploadComplete callback with the file URL
      onUploadComplete(url, key)

      toast.success('Upload complete', {
        description: 'Your file has been uploaded successfully',
      })
    } catch (error) {
      console.error('Upload error:', error)
      onUploadError(error instanceof Error ? error.message : 'Upload failed')

      toast.error('Upload failed', {
        description:
          error instanceof Error ? error.message : 'Failed to upload file',
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleCancel = () => {
    setFileName(null)
    setIsUploading(false)
    setUploadProgress(0)
  }

  const getFileIcon = () => {
    if (fileType === 'asset')
      return <FileText className='h-8 w-8 text-primary' />
    return <ImageIcon className='h-8 w-8 text-primary' />
  }

  return (
    <div className='border-2 border-dashed border-border rounded-lg p-6 text-center'>
      {!fileName ? (
        <>
          <div className='mx-auto mb-4'>
            {fileType === 'asset' ? (
              <Upload className='h-10 w-10 text-muted-foreground mx-auto' />
            ) : (
              <ImageIcon className='h-10 w-10 text-muted-foreground mx-auto' />
            )}
          </div>
          <p className='text-sm text-muted-foreground mb-2'>
            {fileType === 'asset'
              ? 'Upload your asset file (PDF, DOCX, JSON, ZIP, etc.)'
              : 'Upload image'}
          </p>
          <p className='text-xs text-muted-foreground mb-4'>
            Max file size: {maxSize / (1024 * 1024)}MB
          </p>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() =>
              document.getElementById(`file-input-${fileType}`)?.click()
            }
          >
            Select File
          </Button>
          <input
            id={`file-input-${fileType}`}
            type='file'
            className='hidden'
            accept={accept}
            onChange={handleFileChange}
          />
        </>
      ) : (
        <div className='space-y-4'>
          <div className='flex items-center justify-between bg-secondary/50 rounded-md p-3'>
            <div className='flex items-center'>
              {getFileIcon()}
              <div className='text-left ml-3'>
                <p className='text-sm font-medium truncate max-w-[200px]'>
                  {fileName}
                </p>
                {isUploading && (
                  <p className='text-xs text-muted-foreground'>Uploading...</p>
                )}
              </div>
            </div>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={handleCancel}
              disabled={isUploading}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>

          {isUploading && <Progress value={uploadProgress} className='h-2' />}
        </div>
      )}
    </div>
  )
}
