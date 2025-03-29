import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { HEADER_LINKS, ROUTES } from './constants'

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
