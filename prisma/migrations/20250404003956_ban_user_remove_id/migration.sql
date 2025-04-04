/*
  Warnings:

  - The primary key for the `BannedUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "BannedUsers" DROP CONSTRAINT "BannedUsers_pkey";
