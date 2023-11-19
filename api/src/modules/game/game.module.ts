import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma';

import { NotifyModule } from '../notify';
import { UserModule } from '../user';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { PongService } from './pong.service';

@Module({
  imports: [UserModule, NotifyModule],
  controllers: [GameController],
  providers: [GameGateway, GameService, PrismaService, PongService],
  exports: [GameService],
})
export class GameModule {}
