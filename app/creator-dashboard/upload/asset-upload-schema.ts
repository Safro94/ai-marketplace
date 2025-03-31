import { z } from 'zod'

export const assetUploadSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  features: z.string().min(1, 'The product must contain at least one feature'),
  requirements: z.string().optional(),
  featuredImage: z.string().url('Please upload a file'),
  galleryImages: z.array(z.string().url()).default([]),
  assetFile: z.string().url('Please upload a file'),
  slug: z.string(),
  categoryId: z.string(),
  licenses: z.array(
    z.object({
      licenseId: z.string(),
      price: z.number().positive(),
    }),
  ),
})
