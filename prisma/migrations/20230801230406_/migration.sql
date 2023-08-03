/*
  Warnings:

  - A unique constraint covering the columns `[user_id,week,year]` on the table `weekly_scores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "weekly_scores_user_id_week_year_key" ON "weekly_scores"("user_id", "week", "year");
