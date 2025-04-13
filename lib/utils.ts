import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { API_ROUTES, HEADER_LINKS, ROUTES, SERVICE_CHARGE } from './constants'

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

export const getCreatorsLinks = (
  isCreator: boolean,
  hasPendingApplication: boolean,
) => {
  return HEADER_LINKS.map((link) => {
    if (
      isCreator &&
      !hasPendingApplication &&
      link.href === ROUTES.creators()
    ) {
      link.href = ROUTES.creatorDashboard()
    }

    return link
  })
}

export async function tryCatch<T, E = Error>(promise: Promise<T>) {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error) {
    console.error(error)
    return { data: null, error: error as E }
  }
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

export const getServiceCharge = (price: number) => {
  return price ? price * SERVICE_CHARGE : 0
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
  // Fetch the file
  const { data: response, error } = await tryCatch(
    fetch(
      `${API_ROUTES.assetsDownload()}?url=${encodeURIComponent(url)}&assetId=${assetId}`,
    ),
  )

  if (!response?.ok || error) {
    throw Error(error?.message ?? 'Failed to fetch file')
  }

  const blob = await response.blob()

  createDownloadLink(blob, fileName)
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
