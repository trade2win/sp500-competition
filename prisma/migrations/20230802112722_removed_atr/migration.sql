/*
  Warnings:

  - You are about to drop the column `atr` on the `WeeklyPriceHistory` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeeklyPriceHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "index_name" TEXT NOT NULL,
    "open" REAL NOT NULL,
    "close" REAL NOT NULL,
    "previous_close" REAL NOT NULL,
    "high" REAL NOT NULL,
    "low" REAL NOT NULL,
    "week" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_WeeklyPriceHistory" ("close", "created_at", "date", "high", "id", "index_name", "low", "open", "previous_close", "updated_at", "week", "year") SELECT "close", "created_at", "date", "high", "id", "index_name", "low", "open", "previous_close", "updated_at", "week", "year" FROM "WeeklyPriceHistory";
DROP TABLE "WeeklyPriceHistory";
ALTER TABLE "new_WeeklyPriceHistory" RENAME TO "WeeklyPriceHistory";
CREATE INDEX "week_year_idx_history" ON "WeeklyPriceHistory"("week", "year");
CREATE INDEX "date_index_idx" ON "WeeklyPriceHistory"("date", "index_name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
