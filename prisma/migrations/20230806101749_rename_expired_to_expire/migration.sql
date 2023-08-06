/*
  Warnings:

  - You are about to drop the column `expired` on the `Session` table. All the data in the column will be lost.
  - Added the required column `expire` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "session_expired_index";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "expired",
ADD COLUMN     "expire" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "session_expire_index" ON "Session"("expire");
