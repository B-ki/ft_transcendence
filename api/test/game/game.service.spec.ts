import { Test } from '@nestjs/testing';
import { Game, PrismaClient, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { GameService } from '../../src/modules/game';
import { PrismaService } from '../../src/prisma';

describe('Gameservice', () => {
  let gameService: GameService;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GameService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    gameService = module.get(GameService);
    prismaService = module.get(PrismaService);
  });

  it('services should be defined', () => {
    expect(gameService).toBeDefined();
  });

  it('should have functions', () => {
    expect(gameService.createGame).toBeDefined();
    expect(gameService.getAllGames).toBeDefined();
    expect(gameService.getGamesLost).toBeDefined();
    expect(gameService.getGamesWon).toBeDefined();
  });

  const dummyUserOne: User = {
    id: 1,
    login: 'testLoginOne',
    email: 'testMailOne',
    imageUrl: 'testUrlOne',
    displayName: 'testLoginOne',
    firstName: 'testFirstNameOne',
    lastName: 'testLastNameOne',
    isConnected: true,
    bannerUrl: 'bannerUrlOne',
    description: 'descriptionOne',
    createdAt: new Date(),
  };

  const dummyUserTwo: User = {
    id: 2,
    login: 'testLoginTwo',
    email: 'testMailTwo',
    imageUrl: 'testUrlTwo',
    displayName: 'testLoginTwo',
    firstName: 'testFirstNameTwo',
    lastName: 'testLastNameTwo',
    isConnected: true,
    bannerUrl: 'bannerUrlTwo',
    description: 'descriptionTwo',
    createdAt: new Date(),
  };

  const dummyGame: Game = {
    id: 1,
    createdAt: new Date(),
    winnerId: 1,
    loserId: 2,
    winnerScore: 4,
    loserScore: 0,
  };

  it('should get game correctly', async () => {
    prismaService.game.findMany.mockResolvedValue([dummyGame]);
    const result = await gameService.getAllGames('testLoginOne');
    expect(result).toEqual([dummyGame]);
  });
});
