-- CreateEnum
CREATE TYPE "RoomStage" AS ENUM ('Idle', 'Voting', 'Finished');

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stage" "RoomStage" NOT NULL,
    "votes" INTEGER[],

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);
