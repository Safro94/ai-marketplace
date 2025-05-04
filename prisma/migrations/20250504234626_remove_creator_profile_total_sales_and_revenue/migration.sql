/*
  Warnings:

  - You are about to drop the column `totalRevenue` on the `CreatorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `totalSales` on the `CreatorProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CreatorProfile" DROP COLUMN "totalRevenue",
DROP COLUMN "totalSales";
