/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "deletedAt";

-- CreateTable
CREATE TABLE "BannedUsers" (
    "email" TEXT NOT NULL,

    CONSTRAINT "BannedUsers_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "BannedUsers_email_key" ON "BannedUsers"("email");
