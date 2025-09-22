/*
  Warnings:

  - A unique constraint covering the columns `[accountId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seriesId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `library_entries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chapters" ADD COLUMN "mangaMDChapterId" TEXT;
ALTER TABLE "chapters" ADD COLUMN "mangaMDChapterNumber" REAL;
ALTER TABLE "chapters" ADD COLUMN "mangaMDChapterTitle" TEXT;
ALTER TABLE "chapters" ADD COLUMN "mangaMDPages" INTEGER;
ALTER TABLE "chapters" ADD COLUMN "mangaMDPublishAt" DATETIME;
ALTER TABLE "chapters" ADD COLUMN "mangaMDTranslatedLanguage" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "accountId" INTEGER;

-- CreateTable
CREATE TABLE "user_urls" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "chapterId" TEXT,
    "seriesId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "user_urls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ratings_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "series" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "chapterId" TEXT,
    CONSTRAINT "comments_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_comments" ("chapterId", "content", "createdAt", "id", "isHidden", "updatedAt", "userId") SELECT "chapterId", "content", "createdAt", "id", "isHidden", "updatedAt", "userId" FROM "comments";
DROP TABLE "comments";
ALTER TABLE "new_comments" RENAME TO "comments";
CREATE TABLE "new_creator_claims" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "evidence" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "claimantId" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    CONSTRAINT "creator_claims_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "series" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "creator_claims_claimantId_fkey" FOREIGN KEY ("claimantId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_creator_claims" ("claimantId", "createdAt", "evidence", "id", "notes", "seriesId", "status", "updatedAt") SELECT "claimantId", "createdAt", "evidence", "id", "notes", "seriesId", "status", "updatedAt" FROM "creator_claims";
DROP TABLE "creator_claims";
ALTER TABLE "new_creator_claims" RENAME TO "creator_claims";
CREATE TABLE "new_library_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "status" TEXT DEFAULT 'READING',
    "rating" INTEGER,
    "notes" TEXT,
    CONSTRAINT "library_entries_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "series" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "library_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_library_entries" ("createdAt", "id", "seriesId", "userId") SELECT "createdAt", "id", "seriesId", "userId" FROM "library_entries";
DROP TABLE "library_entries";
ALTER TABLE "new_library_entries" RENAME TO "library_entries";
CREATE UNIQUE INDEX "library_entries_userId_seriesId_key" ON "library_entries"("userId", "seriesId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ratings_userId_seriesId_key" ON "ratings"("userId", "seriesId");

-- CreateIndex
CREATE UNIQUE INDEX "users_accountId_key" ON "users"("accountId");
