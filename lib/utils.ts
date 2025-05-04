import { type ClassValue, clsx } from 'clsx'
import { NextRequest } from 'next/server'
import { twMerge } from 'tailwind-merge'
import { API_ROUTES, INFINITE_SCROLL_NUMBER_OF_ITEMS } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  decimalPrecision: number = 2,
) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimalPrecision,
    maximumFractionDigits: decimalPrecision,
  }).format(isNaN(amount) ? 0 : amount)
}

export const downloadAsset = async ({
  url,
  fileName,
  assetId,
}: {
  url: string
  fileName: string
  assetId: string
}) => {
  try {
    const response = await fetch(
      `${API_ROUTES.assetsDownload()}?url=${encodeURIComponent(url)}&assetId=${assetId}`,
    )

    if (!response?.ok) {
      return { success: false, error: 'Failed to fetch file' }
    }

    const blob = await response.blob()
    createDownloadLink(blob, fileName)
    return { success: true }
  } catch (e) {
    console.error(e)
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to fetch file',
    }
  }
}

export const createDownloadLink = (file: Blob, fileName: string) => {
  // Create a URL for the blob
  const blobUrl = window.URL.createObjectURL(file)

  // Create a temporary link element
  const link = document.createElement('a')
  link.href = blobUrl
  link.setAttribute('download', fileName)
  document.body.appendChild(link)

  // Trigger the download
  link.click()

  // Clean up
  document.body.removeChild(link)
  window.URL.revokeObjectURL(blobUrl)
}

export const getInfiniteScrollRouteParams = (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(
    searchParams.get('limit') || INFINITE_SCROLL_NUMBER_OF_ITEMS.toString(),
  )

  // Calculate offset based on page and limit
  const offset = page * limit

  return { offset, limit }
}
