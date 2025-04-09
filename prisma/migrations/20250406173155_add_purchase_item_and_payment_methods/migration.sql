/*
  Warnings:

  - You are about to drop the column `paymentDetails` on the `CreatorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Download` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseId` on the `Download` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Download` table. All the data in the column will be lost.
  - You are about to drop the column `assetId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `assetLicenseId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the column `licenseKey` on the `Purchase` table. All the data in the column will be lost.
  - Added the required column `purchaseItemId` to the `Download` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentProvider` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('PAYPAL');

-- DropForeignKey
ALTER TABLE "Download" DROP CONSTRAINT "Download_assetId_fkey";

-- DropForeignKey
ALTER TABLE "Download" DROP CONSTRAINT "Download_purchaseId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_assetId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_assetLicenseId_fkey";

-- DropIndex
DROP INDEX "Download_assetId_idx";

-- DropIndex
DROP INDEX "Download_purchaseId_idx";

-- DropIndex
DROP INDEX "Download_userId_idx";

-- DropIndex
DROP INDEX "Purchase_assetId_idx";

-- DropIndex
DROP INDEX "Purchase_licenseKey_key";

-- AlterTable
ALTER TABLE "CreatorProfile" DROP COLUMN "paymentDetails";

-- AlterTable
ALTER TABLE "Download" DROP COLUMN "createdAt",
DROP COLUMN "purchaseId",
DROP COLUMN "userId",
ADD COLUMN     "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "purchaseItemId" TEXT NOT NULL,
ALTER COLUMN "assetId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "assetId",
DROP COLUMN "assetLicenseId",
DROP COLUMN "licenseKey",
ADD COLUMN     "paymentDetails" JSONB,
ADD COLUMN     "paymentProvider" "PaymentProvider" NOT NULL;

-- CreateTable
CREATE TABLE "CreatorApplicationPaymentMethod" (
    "id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "accountIdentifier" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "creatorProfileId" TEXT,

    CONSTRAINT "CreatorApplicationPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseItem" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "licenseKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assetLicenseId" TEXT,

    CONSTRAINT "PurchaseItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseItem_licenseKey_key" ON "PurchaseItem"("licenseKey");

-- CreateIndex
CREATE INDEX "PurchaseItem_purchaseId_idx" ON "PurchaseItem"("purchaseId");

-- CreateIndex
CREATE INDEX "PurchaseItem_assetId_idx" ON "PurchaseItem"("assetId");

-- CreateIndex
CREATE INDEX "AssetLicense_assetId_idx" ON "AssetLicense"("assetId");

-- CreateIndex
CREATE INDEX "AssetLicense_licenseId_idx" ON "AssetLicense"("licenseId");

-- CreateIndex
CREATE INDEX "Download_purchaseItemId_idx" ON "Download"("purchaseItemId");

-- AddForeignKey
ALTER TABLE "CreatorApplicationPaymentMethod" ADD CONSTRAINT "CreatorApplicationPaymentMethod_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "CreatorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_assetLicenseId_fkey" FOREIGN KEY ("assetLicenseId") REFERENCES "AssetLicense"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_purchaseItemId_fkey" FOREIGN KEY ("purchaseItemId") REFERENCES "PurchaseItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
