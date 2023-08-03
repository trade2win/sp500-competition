/*
  Warnings:

  - You are about to drop the column `points` on the `prediction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,quarter,year]` on the table `quarterly_scores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,year]` on the table `yearly_scores` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_prediction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "prediction" REAL NOT NULL,
    "direction" INTEGER NOT NULL DEFAULT 0,
    "week" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "prediction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_prediction" ("created_at", "direction", "id", "month", "prediction", "quarter", "updated_at", "user_id", "week", "year") SELECT "created_at", "direction", "id", "month", "prediction", "quarter", "updated_at", "user_id", "week", "year" FROM "prediction";
DROP TABLE "prediction";
ALTER TABLE "new_prediction" RENAME TO "prediction";
CREATE INDEX "week_year_idx" ON "prediction"("week", "year");
CREATE INDEX "month_year_idx" ON "prediction"("month", "year");
CREATE UNIQUE INDEX "prediction_user_id_week_year_key" ON "prediction"("user_id", "week", "year");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "quarterly_scores_user_id_quarter_year_key" ON "quarterly_scores"("user_id", "quarter", "year");

-- CreateIndex
CREATE UNIQUE INDEX "yearly_scores_user_id_year_key" ON "yearly_scores"("user_id", "year");
