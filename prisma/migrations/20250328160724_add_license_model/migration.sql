/*
  Warnings:

  - You are about to drop the column `licenseType` on the `Purchase` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[licenseKey]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "licenseType",
ADD COLUMN     "assetLicenseId" TEXT,
ADD COLUMN     "licenseKey" TEXT;

-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT[],
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetLicense" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AssetLicense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssetLicense_assetId_licenseId_key" ON "AssetLicense"("assetId", "licenseId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_licenseKey_key" ON "Purchase"("licenseKey");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_assetLicenseId_fkey" FOREIGN KEY ("assetLicenseId") REFERENCES "AssetLicense"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetLicense" ADD CONSTRAINT "AssetLicense_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetLicense" ADD CONSTRAINT "AssetLicense_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
