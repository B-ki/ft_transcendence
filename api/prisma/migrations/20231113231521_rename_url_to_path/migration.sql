/*
  Warnings:

  - You are about to drop the column `bannerUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "bannerUrl",
DROP COLUMN "imageUrl",
ADD COLUMN     "bannerPath" TEXT,
ADD COLUMN     "imagePath" TEXT;
