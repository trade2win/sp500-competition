-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Prediction" (
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
INSERT INTO "new_Prediction" ("created_at", "direction", "id", "prediction", "updated_at", "user_id", "week", "year") SELECT "created_at", "direction", "id", "prediction", "updated_at", "user_id", "week", "year" FROM "Prediction";
DROP TABLE "Prediction";
ALTER TABLE "new_Prediction" RENAME TO "Prediction";
CREATE INDEX "week_year_idx" ON "Prediction"("week", "year");
CREATE UNIQUE INDEX "Prediction_user_id_week_year_key" ON "Prediction"("user_id", "week", "year");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
