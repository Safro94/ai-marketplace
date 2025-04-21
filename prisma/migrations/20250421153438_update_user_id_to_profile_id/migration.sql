/*
  Warnings:

  - You are about to drop the column `userId` on the `Download` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PageVisit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId,assetId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropIndex
DROP INDEX "Download_userId_idx";

-- DropIndex
DROP INDEX "Favorite_userId_assetId_key";

-- DropIndex
DROP INDEX "Favorite_userId_idx";

-- DropIndex
DROP INDEX "Notification_userId_idx";

-- DropIndex
DROP INDEX "PageVisit_userId_idx";

-- AlterTable
ALTER TABLE "Download" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PageVisit" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT;

-- CreateIndex
CREATE INDEX "Download_profileId_idx" ON "Download"("profileId");

-- CreateIndex
CREATE INDEX "Favorite_profileId_idx" ON "Favorite"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_profileId_assetId_key" ON "Favorite"("profileId", "assetId");

-- CreateIndex
CREATE INDEX "Notification_profileId_idx" ON "Notification"("profileId");

-- CreateIndex
CREATE INDEX "PageVisit_profileId_idx" ON "PageVisit"("profileId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
