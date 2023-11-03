import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma';

import { UserModule } from '../user';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [UserModule],
  controllers: [GameController],
  providers: [GameGateway, GameService, PrismaService],
  exports: [GameService],
})
export class GameModule {}
