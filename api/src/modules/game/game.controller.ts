import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { JwtAuthGuard } from '../auth';
import { GetUser } from '../auth/decorators';
import { UserService } from '../user';
import { CreateGameDto } from './game.dto';
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
  async createGame(@Body() game: CreateGameDto) {
    const winner = await this.userService.getUnique(game.winnerLogin);
    const loser = await this.userService.getUnique(game.loserLogin);
    this.gameService.createGame(winner, loser, game.winnerScore, game.loserScore);
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
    return this.gameService.getAllGames(user);
  }
}