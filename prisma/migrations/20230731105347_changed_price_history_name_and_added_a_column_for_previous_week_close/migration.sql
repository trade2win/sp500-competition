/*
  Warnings:

  - You are about to drop the `price_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "price_history";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "weekly_price_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "index_name" TEXT NOT NULL,
    "open" REAL NOT NULL,
    "close" REAL NOT NULL,
    "previous_close" REAL NOT NULL,
    "high" REAL NOT NULL,
    "low" REAL NOT NULL,
    "atr" REAL NOT NULL,
    "week" INTEGER NOT NULL,
    "week_of_month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "week_year_idx_history" ON "weekly_price_history"("week", "year");

-- CreateIndex
CREATE INDEX "date_index_idx" ON "weekly_price_history"("date", "index_name");

-- CreateIndex
CREATE INDEX "week_year_month_idx" ON "weekly_price_history"("week", "week_of_month");
