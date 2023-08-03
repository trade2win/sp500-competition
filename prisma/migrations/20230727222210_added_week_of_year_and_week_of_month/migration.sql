/*
  Warnings:

  - You are about to drop the column `week` on the `Forecast` table. All the data in the column will be lost.
  - Added the required column `month` to the `Forecast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekOfMonth` to the `Forecast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekOfYear` to the `Forecast` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Forecast" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "prediction" REAL NOT NULL,
    "weekOfYear" INTEGER NOT NULL,
    "weekOfMonth" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Forecast_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Forecast" ("createdAt", "prediction", "id", "points", "updatedAt", "userId", "year") SELECT "createdAt", "prediction", "id", "points", "updatedAt", "userId", "year" FROM "Forecast";
DROP TABLE "Forecast";
ALTER TABLE "new_Forecast" RENAME TO "Forecast";
CREATE INDEX "week_year_idx" ON "Forecast"("weekOfYear", "year");
CREATE INDEX "month_year_idx" ON "Forecast"("month", "year");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
