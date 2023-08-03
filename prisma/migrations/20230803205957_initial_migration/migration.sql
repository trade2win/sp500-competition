-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "xenforo_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "prediction" DOUBLE PRECISION NOT NULL,
    "direction" INTEGER NOT NULL DEFAULT 0,
    "week" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyScore" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "direction_points" INTEGER NOT NULL,
    "medal_points" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyPriceHistory" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "index_name" TEXT NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "previous_close" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "week" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyPriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_xenforo_id_key" ON "User"("xenforo_id");

-- CreateIndex
CREATE INDEX "week_year_idx" ON "Prediction"("week", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_user_id_week_year_key" ON "Prediction"("user_id", "week", "year");

-- CreateIndex
CREATE INDEX "week_year_idx_scores" ON "WeeklyScore"("week", "year");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyScore_user_id_week_year_key" ON "WeeklyScore"("user_id", "week", "year");

-- CreateIndex
CREATE INDEX "week_year_idx_history" ON "WeeklyPriceHistory"("week", "year");

-- CreateIndex
CREATE INDEX "date_index_idx" ON "WeeklyPriceHistory"("date", "index_name");

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyScore" ADD CONSTRAINT "WeeklyScore_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
