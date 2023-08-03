/*
  Warnings:

  - You are about to drop the column `bronze_medals` on the `WeeklyScore` table. All the data in the column will be lost.
  - You are about to drop the column `gold_medals` on the `WeeklyScore` table. All the data in the column will be lost.
  - You are about to drop the column `silver_medals` on the `WeeklyScore` table. All the data in the column will be lost.
  - You are about to drop the column `total_points` on the `WeeklyScore` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeeklyScore" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "direction_points" INTEGER NOT NULL,
    "medal_points" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "WeeklyScore_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WeeklyScore" ("created_at", "direction_points", "id", "medal_points", "updated_at", "user_id", "week", "year") SELECT "created_at", "direction_points", "id", "medal_points", "updated_at", "user_id", "week", "year" FROM "WeeklyScore";
DROP TABLE "WeeklyScore";
ALTER TABLE "new_WeeklyScore" RENAME TO "WeeklyScore";
CREATE INDEX "week_year_idx_scores" ON "WeeklyScore"("week", "year");
CREATE UNIQUE INDEX "WeeklyScore_user_id_week_year_key" ON "WeeklyScore"("user_id", "week", "year");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
