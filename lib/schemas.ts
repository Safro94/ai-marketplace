import { LicenseType } from '@prisma/client'
import { z } from 'zod'
import { BIO_MAX_LENGTH } from './constants'

export const assetUploadSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z
    .string()
    .min(150, 'Description must be at least 150 characters'),
  features: z.string().min(1, 'The product must contain at least one feature'),
  requirements: z.string().optional(),
  featuredImage: z.string().url('Please upload a file'),
  galleryImages: z.array(z.string().url()).default([]),
  assetFile: z.string().url('Please upload a file'),
  slug: z.string(),
  categoryId: z.string(),
  licenses: z.array(
    z.object({
      licenseId: z.enum([LicenseType.STANDARD, LicenseType.EXTENDED]),
      price: z.number().positive(),
    }),
  ),
})

export const creatorApplicationSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  website: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  expertise: z
    .string()
    .min(1, { message: 'Please select your area of expertise' }),
  experience: z
    .string()
    .min(1, { message: 'Please select your experience level' }),
  bio: z
    .string()
    .min(50, { message: 'Bio must be at least 50 characters' })
    .max(BIO_MAX_LENGTH, {
      message: `Bio cannot exceed ${BIO_MAX_LENGTH} characters`,
    }),
  assetTypes: z.string().min(10, {
    message: 'Please describe the types of assets you plan to sell',
  }),
  portfolio: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .optional()
    .or(z.literal('')),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
})

export const userAccountSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  website: z.string().url({ message: 'Invalid URL' }).optional(),
  githubHandle: z
    .string()
    .min(2, { message: 'GitHub handle must be at least 2 characters' })
    .optional(),
  twitterHandle: z
    .string()
    .min(2, { message: 'Twitter handle must be at least 2 characters' })
    .optional(),
  bio: z
    .string()
    .max(BIO_MAX_LENGTH, {
      message: `Bio cannot exceed ${BIO_MAX_LENGTH} characters`,
    })
    .optional(),
})
