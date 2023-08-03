/*
  Warnings:

  - You are about to drop the `prediction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `weekly_price_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `weekly_scores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "prediction";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "weekly_price_history";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "weekly_scores";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "xenforo_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "prediction" REAL NOT NULL,
    "direction" INTEGER NOT NULL DEFAULT 0,
    "week" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Prediction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeeklyPriceHistory" (
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

-- CreateTable
CREATE TABLE "WeeklyScore" (
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
    CONSTRAINT "WeeklyScore_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_xenforo_id_key" ON "User"("xenforo_id");

-- CreateIndex
CREATE INDEX "week_year_idx" ON "Prediction"("week", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_user_id_week_year_key" ON "Prediction"("user_id", "week", "year");

-- CreateIndex
CREATE INDEX "week_year_idx_history" ON "WeeklyPriceHistory"("week", "year");

-- CreateIndex
CREATE INDEX "date_index_idx" ON "WeeklyPriceHistory"("date", "index_name");

-- CreateIndex
CREATE INDEX "week_year_idx_scores" ON "WeeklyScore"("week", "year");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyScore_user_id_week_year_key" ON "WeeklyScore"("user_id", "week", "year");
