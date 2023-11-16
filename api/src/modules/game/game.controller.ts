import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { JwtTwoFaAuthGuard } from '../auth';
import { GetUser } from '../auth/decorators';
import { CreateGameDto } from './game.dto';
import { GameService } from './game.service';

@Controller('game')
@UseGuards(JwtTwoFaAuthGuard)
@ApiBearerAuth()
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('/create')
  async createGame(@Body() game: CreateGameDto) {
    this.gameService.createGame(
      game.winnerLogin,
      game.loserLogin,
      game.winnerScore,
      game.loserScore,
    );
  }

  @Get('/won')
  async getWonGames(@GetUser() user: User) {
    return this.gameService.getGamesWon(user);
  }

  @Get('/lost')
  async getLostGames(@GetUser() user: User) {
    return this.gameService.getGamesLost(user);
  }

  @Get('/all')
  async getAllGames(@GetUser() user: User) {
    return this.gameService.getAllGames(user.login);
  }

  @Get('/all/:login')
  async getAllGamesFromUser(@Param('login') login: string) {
    return this.gameService.getAllGames(login);
  }
}
