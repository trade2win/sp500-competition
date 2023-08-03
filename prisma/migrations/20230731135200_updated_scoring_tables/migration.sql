/*
  Warnings:

  - You are about to alter the column `direction` on the `prediction` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to drop the column `correct_direction` on the `quarterly_scores` table. All the data in the column will be lost.
  - You are about to drop the column `correct_direction` on the `weekly_scores` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `weekly_scores` table. All the data in the column will be lost.
  - You are about to drop the column `correct_direction` on the `yearly_scores` table. All the data in the column will be lost.
  - Added the required column `direction_points` to the `quarterly_scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medal_points` to the `quarterly_scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weeks_played` to the `quarterly_scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direction_points` to the `weekly_scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medal_points` to the `weekly_scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_points` to the `weekly_scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direction_points` to the `yearly_scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medal_points` to the `yearly_scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weeks_played` to the `yearly_scores` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_prediction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "prediction" REAL NOT NULL,
    "direction" INTEGER NOT NULL DEFAULT 0,
    "week" INTEGER NOT NULL,
    "week_of_month" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "prediction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_prediction" ("created_at", "direction", "prediction", "id", "month", "points", "updated_at", "user_id", "week_of_month", "week", "year") SELECT "created_at", "direction", "prediction", "id", "month", "points", "updated_at", "user_id", "week_of_month", "week", "year" FROM "prediction";
DROP TABLE "prediction";
ALTER TABLE "new_prediction" RENAME TO "prediction";
CREATE INDEX "week_year_idx" ON "prediction"("week", "year");
CREATE INDEX "month_year_idx" ON "prediction"("month", "year");
CREATE TABLE "new_quarterly_scores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "total_points" INTEGER NOT NULL,
    "direction_points" INTEGER NOT NULL,
    "medal_points" INTEGER NOT NULL,
    "gold_medals" INTEGER NOT NULL,
    "silver_medals" INTEGER NOT NULL,
    "bronze_medals" INTEGER NOT NULL,
    "weeks_played" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "quarterly_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_quarterly_scores" ("bronze_medals", "created_at", "gold_medals", "id", "quarter", "silver_medals", "total_points", "updated_at", "user_id", "year") SELECT "bronze_medals", "created_at", "gold_medals", "id", "quarter", "silver_medals", "total_points", "updated_at", "user_id", "year" FROM "quarterly_scores";
DROP TABLE "quarterly_scores";
ALTER TABLE "new_quarterly_scores" RENAME TO "quarterly_scores";
CREATE INDEX "quarter_year_idx_scores" ON "quarterly_scores"("quarter", "year");
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
    "week_of_month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "weekly_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_weekly_scores" ("bronze_medals", "created_at", "gold_medals", "id", "silver_medals", "updated_at", "user_id", "week_of_month", "week", "year") SELECT "bronze_medals", "created_at", "gold_medals", "id", "silver_medals", "updated_at", "user_id", "week_of_month", "week", "year" FROM "weekly_scores";
DROP TABLE "weekly_scores";
ALTER TABLE "new_weekly_scores" RENAME TO "weekly_scores";
CREATE INDEX "week_month_year_idx_scores" ON "weekly_scores"("week", "week_of_month", "year");
CREATE TABLE "new_yearly_scores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "total_points" INTEGER NOT NULL,
    "direction_points" INTEGER NOT NULL,
    "medal_points" INTEGER NOT NULL,
    "gold_medals" INTEGER NOT NULL,
    "silver_medals" INTEGER NOT NULL,
    "bronze_medals" INTEGER NOT NULL,
    "weeks_played" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "yearly_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_yearly_scores" ("bronze_medals", "created_at", "gold_medals", "id", "silver_medals", "total_points", "updated_at", "user_id", "year") SELECT "bronze_medals", "created_at", "gold_medals", "id", "silver_medals", "total_points", "updated_at", "user_id", "year" FROM "yearly_scores";
DROP TABLE "yearly_scores";
ALTER TABLE "new_yearly_scores" RENAME TO "yearly_scores";
CREATE INDEX "year_idx_scores" ON "yearly_scores"("year");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
