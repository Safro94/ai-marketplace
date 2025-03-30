/*
  Warnings:

  - You are about to drop the column `extendedPrice` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `standardPrice` on the `Asset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "extendedPrice",
DROP COLUMN "price",
DROP COLUMN "standardPrice";
