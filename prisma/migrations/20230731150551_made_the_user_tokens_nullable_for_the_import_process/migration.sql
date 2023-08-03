-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "xenforo_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_user" ("access_token", "created_at", "id", "refresh_token", "updated_at", "username", "xenforo_id") SELECT "access_token", "created_at", "id", "refresh_token", "updated_at", "username", "xenforo_id" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_xenforo_id_key" ON "user"("xenforo_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
