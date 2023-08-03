/*
  Warnings:

  - A unique constraint covering the columns `[user_id,week,year]` on the table `prediction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "prediction_user_id_week_year_key" ON "prediction"("user_id", "week", "year");
