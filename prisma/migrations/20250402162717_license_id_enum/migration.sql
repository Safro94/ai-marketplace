/*
  Warnings:

  - The primary key for the `License` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `License` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id]` on the table `License` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `licenseId` on the `AssetLicense` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AssetLicense" DROP CONSTRAINT "AssetLicense_licenseId_fkey";

-- AlterTable
ALTER TABLE "AssetLicense" DROP COLUMN "licenseId",
ADD COLUMN     "licenseId" "LicenseType" NOT NULL;

-- AlterTable
ALTER TABLE "License" DROP CONSTRAINT "License_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" "LicenseType" NOT NULL DEFAULT 'STANDARD';

-- CreateIndex
CREATE UNIQUE INDEX "AssetLicense_assetId_licenseId_key" ON "AssetLicense"("assetId", "licenseId");

-- CreateIndex
CREATE UNIQUE INDEX "License_id_key" ON "License"("id");

-- AddForeignKey
ALTER TABLE "AssetLicense" ADD CONSTRAINT "AssetLicense_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
