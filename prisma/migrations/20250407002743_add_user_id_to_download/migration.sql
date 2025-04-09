/*
  Warnings:

  - Added the required column `userId` to the `Download` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Download" ADD COLUMN     "profileId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Download_userId_idx" ON "Download"("userId");

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
