/*
  Warnings:

  - You are about to drop the column `isCreator` on the `Profile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CREATOR', 'USER');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "isCreator",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
