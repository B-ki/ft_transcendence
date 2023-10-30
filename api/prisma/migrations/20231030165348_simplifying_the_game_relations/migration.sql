/*
  Warnings:

  - You are about to drop the `GameUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `loserId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GameUser" DROP CONSTRAINT "GameUser_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GameUser" DROP CONSTRAINT "GameUser_loserId_fkey";

-- DropForeignKey
ALTER TABLE "GameUser" DROP CONSTRAINT "GameUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "GameUser" DROP CONSTRAINT "GameUser_winnerId_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "loserId" INTEGER NOT NULL,
ADD COLUMN     "winnerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "GameUser";

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
