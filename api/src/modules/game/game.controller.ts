import { Body, Controller, Get, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { JwtAuthGuard } from '../auth';
import { GetUser } from '../auth/decorators';
import { UserService } from '../user';
import { GameService } from './game.service';

@Controller('game')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GameController {
  constructor(
    private gameService: GameService,
    private userService: UserService,
  ) {}

  @Post('/create')
  async createGame(
    @Body('winnerLogin') winnerLogin: string,
    @Body('loserLogin') loserLogin: string,
    @Body('winnerScore') winnerScore: string,
    @Body('loserScore') loserScore: string,
  ) {
    // eslint-disable-next-line no-useless-catch
    try {
      const w: number = +winnerScore;
      const l: number = +loserScore;
      const winner = await this.userService.getUnique(winnerLogin);

      const loser = await this.userService.getUnique(loserLogin);

      this.gameService.createGame(winner, loser, w, l);
    } catch (e) {
      throw e;
    }
  }

  @Get('/won')
  async getWonGames(@GetUser() user: User) {
    const logger = new Logger();
    logger.debug(user);
    return this.gameService.getGamesWon(user);
  }

  @Get('/lost')
  async getLostGames(@GetUser() user: User) {
    const logger = new Logger();
    logger.debug(user);
    return this.gameService.getGamesLost(user);
  }

  @Get('/all')
  async getAllGames(@GetUser() user: User) {
    const logger = new Logger();
    logger.debug(user);
    return this.gameService.getAllGames(user);
  }
}
