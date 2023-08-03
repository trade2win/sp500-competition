/*
  Warnings:

  - You are about to drop the `quarterly_scores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `yearly_scores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `month` on the `prediction` table. All the data in the column will be lost.
  - You are about to drop the column `quarter` on the `prediction` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `weekly_scores` table. All the data in the column will be lost.
  - You are about to drop the column `quarter` on the `weekly_scores` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `weekly_price_history` table. All the data in the column will be lost.
  - You are about to drop the column `quarter` on the `weekly_price_history` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "quarterly_scores_user_id_quarter_year_key";

-- DropIndex
DROP INDEX "quarter_year_idx_scores";

-- DropIndex
DROP INDEX "yearly_scores_user_id_year_key";

-- DropIndex
DROP INDEX "year_idx_scores";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "quarterly_scores";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "yearly_scores";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_prediction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "prediction" REAL NOT NULL,
    "direction" INTEGER NOT NULL DEFAULT 0,
    "week" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "prediction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_prediction" ("created_at", "direction", "id", "prediction", "updated_at", "user_id", "week", "year") SELECT "created_at", "direction", "id", "prediction", "updated_at", "user_id", "week", "year" FROM "prediction";
DROP TABLE "prediction";
ALTER TABLE "new_prediction" RENAME TO "prediction";
CREATE INDEX "week_year_idx" ON "prediction"("week", "year");
CREATE UNIQUE INDEX "prediction_user_id_week_year_key" ON "prediction"("user_id", "week", "year");
CREATE TABLE "new_weekly_scores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "total_points" INTEGER NOT NULL,
    "direction_points" INTEGER NOT NULL,
    "medal_points" INTEGER NOT NULL,
    "gold_medals" INTEGER NOT NULL,
    "silver_medals" INTEGER NOT NULL,
    "bronze_medals" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "weekly_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_weekly_scores" ("bronze_medals", "created_at", "direction_points", "gold_medals", "id", "medal_points", "silver_medals", "total_points", "updated_at", "user_id", "week", "year") SELECT "bronze_medals", "created_at", "direction_points", "gold_medals", "id", "medal_points", "silver_medals", "total_points", "updated_at", "user_id", "week", "year" FROM "weekly_scores";
DROP TABLE "weekly_scores";
ALTER TABLE "new_weekly_scores" RENAME TO "weekly_scores";
CREATE INDEX "week_year_idx_scores" ON "weekly_scores"("week", "year");
CREATE UNIQUE INDEX "weekly_scores_user_id_week_year_key" ON "weekly_scores"("user_id", "week", "year");
CREATE TABLE "new_weekly_price_history" (
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
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_weekly_price_history" ("atr", "close", "created_at", "date", "high", "id", "index_name", "low", "open", "previous_close", "updated_at", "week", "year") SELECT "atr", "close", "created_at", "date", "high", "id", "index_name", "low", "open", "previous_close", "updated_at", "week", "year" FROM "weekly_price_history";
DROP TABLE "weekly_price_history";
ALTER TABLE "new_weekly_price_history" RENAME TO "weekly_price_history";
CREATE INDEX "week_year_idx_history" ON "weekly_price_history"("week", "year");
CREATE INDEX "date_index_idx" ON "weekly_price_history"("date", "index_name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
