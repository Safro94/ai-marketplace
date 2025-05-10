-- CreateEnum
CREATE TYPE "PrimaryMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "primaryMediaType" "PrimaryMediaType" NOT NULL DEFAULT 'IMAGE';
