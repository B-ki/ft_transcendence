import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Game, User } from '@prisma/client';

import { PrismaService } from '@/prisma';

import { UserService } from '../user';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createGame(
    winnerLogin: string,
    loserLogin: string,
    scoreWinner: number,
    scoreLoser: number,
  ): Promise<void> {
    const winner = await this.userService.getUnique(winnerLogin);

    if (!winner) throw new NotFoundException(`User ${winnerLogin} does not exists`);

    const loser = await this.userService.getUnique(loserLogin);

    if (!loser) throw new NotFoundException(`User ${loserLogin} does not exists`);

    if (scoreWinner < 0 || scoreLoser < 0) throw new BadRequestException('Score must be positive');

    if (winner.id === loser.id)
      throw new BadRequestException('One player cannot play against himself.');

    await this.prisma.game.create({
      data: {
        winnerScore: scoreWinner,
        loserScore: scoreLoser,
        winner: {
          connect: winner,
        },
        loser: {
          connect: loser,
        },
      },
    });
  }

  async getGamesWon(user: User): Promise<Game[] | null> {
    const games = await this.prisma.game.findMany({
      where: {
        winnerId: user.id,
      },
    });
    return games;
  }

  async getGamesLost(user: User): Promise<Game[] | null> {
    const games = await this.prisma.game.findMany({
      where: {
        loserId: user.id,
      },
    });
    return games;
  }

  async getAllGames(userLogin: string): Promise<Game[] | null> {
    const games = await this.prisma.game.findMany({
      where: {
        OR: [
          {
            winner: {
              login: userLogin,
            },
          },
          {
            loser: {
              login: userLogin,
            },
          },
        ],
      },
      include: {
        winner: true,
        loser: true,
      },
      take: 30,
    });
    return games;
  }
}
