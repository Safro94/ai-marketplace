export const validateAssetId = async (params: Promise<{ id: string }>) => {
  const assetId = (await params).id

  if (!assetId) {
    throw new Error('Asset not found')
  }

  return { assetId }
}
