-- DropForeignKey
ALTER TABLE "Download" DROP CONSTRAINT "Download_purchaseItemId_fkey";

-- AlterTable
ALTER TABLE "Download" ALTER COLUMN "purchaseItemId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_purchaseItemId_fkey" FOREIGN KEY ("purchaseItemId") REFERENCES "PurchaseItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
