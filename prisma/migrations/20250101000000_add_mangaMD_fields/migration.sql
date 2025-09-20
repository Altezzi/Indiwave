-- AddMangaMDFields migration
-- This migration adds MangaMD integration fields to the Series table

-- Add MangaMD integration fields to series table
ALTER TABLE "series" ADD COLUMN "mangaMDId" TEXT;
ALTER TABLE "series" ADD COLUMN "mangaMDTitle" TEXT;
ALTER TABLE "series" ADD COLUMN "mangaMDStatus" TEXT;
ALTER TABLE "series" ADD COLUMN "mangaMDYear" INTEGER;
ALTER TABLE "series" ADD COLUMN "contentRating" TEXT;
ALTER TABLE "series" ADD COLUMN "tags" TEXT;
ALTER TABLE "series" ADD COLUMN "authors" TEXT;
ALTER TABLE "series" ADD COLUMN "artists" TEXT;
ALTER TABLE "series" ADD COLUMN "altTitles" TEXT;
ALTER TABLE "series" ADD COLUMN "isImported" BOOLEAN NOT NULL DEFAULT false;

-- Create unique index on mangaMDId
CREATE UNIQUE INDEX "series_mangaMDId_key" ON "series"("mangaMDId");
