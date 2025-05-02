/*
  Warnings:

  - You are about to drop the column `views` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `AssetAnalytics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "views";

-- AlterTable
ALTER TABLE "AssetAnalytics" DROP COLUMN "views";
