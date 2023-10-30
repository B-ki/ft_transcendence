import { Injectable, Logger } from '@nestjs/common';
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
    // eslint-disable-next-line no-useless-catch
    const logger = new Logger();
    logger.debug(winner);
    logger.debug(loser);
    logger.debug(scoreWinner);
    logger.debug(scoreLoser);
    await this.prisma.game.create({
      data: {
        winnerScore: scoreWinner,
        loserScore: scoreLoser,
        winner: {
          connect: { id: winner.id },
        },
        loser: {
          connect: { id: loser.id },
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
