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
