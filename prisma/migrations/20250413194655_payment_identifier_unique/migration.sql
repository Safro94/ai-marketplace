/*
  Warnings:

  - A unique constraint covering the columns `[provider,accountIdentifier]` on the table `CreatorApplicationPaymentMethod` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CreatorApplicationPaymentMethod_provider_accountIdentifier_key" ON "CreatorApplicationPaymentMethod"("provider", "accountIdentifier");
