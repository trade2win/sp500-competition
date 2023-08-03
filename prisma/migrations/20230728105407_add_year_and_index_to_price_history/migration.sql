/*
  Warnings:

  - Added the required column `year` to the `price_history` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_price_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "index_name" TEXT NOT NULL,
    "open" REAL NOT NULL,
    "close" REAL NOT NULL,
    "high" REAL NOT NULL,
    "low" REAL NOT NULL,
    "atr" REAL NOT NULL,
    "week" INTEGER NOT NULL,
    "week_of_month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_price_history" ("atr", "close", "created_at", "date", "high", "id", "index_name", "low", "open", "updated_at", "week_of_month", "week") SELECT "atr", "close", "created_at", "date", "high", "id", "index_name", "low", "open", "updated_at", "week_of_month", "week" FROM "price_history";
DROP TABLE "price_history";
ALTER TABLE "new_price_history" RENAME TO "price_history";
CREATE INDEX "week_year_idx_history" ON "price_history"("week", "year");
CREATE INDEX "date_index_idx" ON "price_history"("date", "index_name");
CREATE INDEX "week_year_month_idx" ON "price_history"("week", "week_of_month");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
