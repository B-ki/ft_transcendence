import { Injectable } from '@nestjs/common';
import { Game, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async createGame(
    winner: User,
    loser: User,
    scoreWinner: number,
    scoreLoser: number,
  ): Promise<void> {
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

  async getAllGames(user: User): Promise<Game[] | null> {
    const games = await this.prisma.game.findMany({
      where: {
        OR: [
          {
            winnerId: user.id,
          },
          {
            loserId: user.id,
          },
        ],
      },
    });
    return games;
  }
}