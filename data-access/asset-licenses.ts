import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import 'server-only'

export const getAssetLicensesByAssetId = async <
  T extends Prisma.AssetLicenseFindManyArgs,
>(
  assetId: string,
  args?: T,
): Promise<Prisma.AssetLicenseGetPayload<T>[]> => {
  return (await prisma.assetLicense.findMany({
    where: { assetId },
    ...args,
  })) as Prisma.AssetLicenseGetPayload<T>[]
}

export const deleteAssetLicense = async (
  where: Prisma.AssetLicenseWhereUniqueInput,
) => {
  return await prisma.assetLicense.delete({
    where,
  })
}

export const deleteAssetLicensesByAssetId = async (assetId: string) => {
  return await prisma.assetLicense.deleteMany({
    where: { assetId },
  })
}

export const createAssetLicense = async (
  data: Prisma.AssetLicenseCreateArgs['data'],
) => {
  await prisma.assetLicense.create({
    data,
  })
}

export const updateAssetLincese = async (
  args: Prisma.AssetLicenseUpdateArgs,
) => {
  return await prisma.assetLicense.update(args)
}
