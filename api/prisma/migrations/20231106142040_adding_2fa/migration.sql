-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isTwoFaEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorAuthSecret" TEXT;
