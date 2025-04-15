'use server'

import { downloadCreate } from '@/data-access/download'

export const saveDownload = async (assetId: string, purchaseItemId: string) => {
  await downloadCreate({ assetId, purchaseItemId })
}
