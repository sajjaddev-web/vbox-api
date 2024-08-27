/*
  Warnings:

  - You are about to drop the column `baner` on the `Music` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Music" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "banner" TEXT,
    "url" TEXT NOT NULL,
    "text" TEXT,
    "singer" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Music_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Music" ("id", "singer", "slug", "text", "title", "type", "url", "userId") SELECT "id", "singer", "slug", "text", "title", "type", "url", "userId" FROM "Music";
DROP TABLE "Music";
ALTER TABLE "new_Music" RENAME TO "Music";
CREATE UNIQUE INDEX "Music_slug_key" ON "Music"("slug");
CREATE INDEX "Music_slug_idx" ON "Music"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
