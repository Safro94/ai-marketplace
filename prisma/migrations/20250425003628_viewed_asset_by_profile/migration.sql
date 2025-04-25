-- CreateTable
CREATE TABLE "_ProfileViewedAssets" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfileViewedAssets_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProfileViewedAssets_B_index" ON "_ProfileViewedAssets"("B");

-- AddForeignKey
ALTER TABLE "_ProfileViewedAssets" ADD CONSTRAINT "_ProfileViewedAssets_A_fkey" FOREIGN KEY ("A") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileViewedAssets" ADD CONSTRAINT "_ProfileViewedAssets_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
