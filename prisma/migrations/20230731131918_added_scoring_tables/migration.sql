-- CreateTable
CREATE TABLE "weekly_scores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "correct_direction" INTEGER NOT NULL,
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

-- CreateTable
CREATE TABLE "quarterly_scores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "total_points" INTEGER NOT NULL,
    "correct_direction" INTEGER NOT NULL,
    "gold_medals" INTEGER NOT NULL,
    "silver_medals" INTEGER NOT NULL,
    "bronze_medals" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "quarterly_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "yearly_scores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "total_points" INTEGER NOT NULL,
    "correct_direction" INTEGER NOT NULL,
    "gold_medals" INTEGER NOT NULL,
    "silver_medals" INTEGER NOT NULL,
    "bronze_medals" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "yearly_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_prediction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "prediction" REAL NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'STABLE',
    "week" INTEGER NOT NULL,
    "week_of_month" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "prediction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_prediction" ("created_at", "prediction", "id", "month", "points", "updated_at", "user_id", "week_of_month", "week", "year") SELECT "created_at", "prediction", "id", "month", "points", "updated_at", "user_id", "week_of_month", "week", "year" FROM "prediction";
DROP TABLE "prediction";
ALTER TABLE "new_prediction" RENAME TO "prediction";
CREATE INDEX "week_year_idx" ON "prediction"("week", "year");
CREATE INDEX "month_year_idx" ON "prediction"("month", "year");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "week_month_year_idx_scores" ON "weekly_scores"("week", "week_of_month", "year");

-- CreateIndex
CREATE INDEX "quarter_year_idx_scores" ON "quarterly_scores"("quarter", "year");

-- CreateIndex
CREATE INDEX "year_idx_scores" ON "yearly_scores"("year");
