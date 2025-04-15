/*
  Warnings:

  - You are about to drop the column `userId` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assetId,userProfileId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userProfileId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropIndex
DROP INDEX "Review_assetId_userId_key";

-- DropIndex
DROP INDEX "Review_userId_idx";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "userId",
ADD COLUMN     "userProfileId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Review_userProfileId_idx" ON "Review"("userProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_assetId_userProfileId_key" ON "Review"("assetId", "userProfileId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
