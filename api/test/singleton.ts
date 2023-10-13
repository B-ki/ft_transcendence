import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';

import { PrismaService } from '@/prisma';

import prisma from './prisma-client';

jest.mock('./prisma-client', () => ({
  __esModule: true,
  default: mockDeep<PrismaService>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaService>;
