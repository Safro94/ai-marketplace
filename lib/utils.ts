import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
  FIXED_TRANSACTION_FEE,
  HEADER_LINKS,
  ROUTES,
  SERVICE_CHARGE,
} from './constants'

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
  return price ? price * SERVICE_CHARGE + FIXED_TRANSACTION_FEE : 0
}

export const downloadAsset = async (url: string, fileName: string) => {
  // Fetch the file
  const response = await fetch(url)

  if (!response.ok) {
    throw Error('Failed to fetch file')
  }

  // Get the blob from the response
  const blob = await response.blob()

  // Create a URL for the blob
  const blobUrl = window.URL.createObjectURL(blob)

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
