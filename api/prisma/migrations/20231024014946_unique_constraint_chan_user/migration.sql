/*
  Warnings:

  - A unique constraint covering the columns `[userId,channelId]` on the table `ChannelUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChannelUser_userId_channelId_key" ON "ChannelUser"("userId", "channelId");
