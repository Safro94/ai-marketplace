import { API_ROUTES } from '@/lib/constants'
import { LicenseOption } from '@/lib/types'
import { tryCatch } from '@/lib/utils'

export const getLicenses = async (assetId: string) => {
  const { data: response, error } = await tryCatch(
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}${API_ROUTES.assetsLicenses(assetId)}`,
    ),
  )

  if (!response?.ok) throw new Error('Failed to fetch license options')
  if (error) throw new Error(error)

  const data: LicenseOption[] = await response.json()

  return { data }
}
