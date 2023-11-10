/*
  Warnings:

  - You are about to drop the column `isConnected` on the `User` table. All the data in the column will be lost.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('OFFLINE', 'ONLINE', 'INGAME');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isConnected",
ADD COLUMN     "status" "UserStatus" NOT NULL;
