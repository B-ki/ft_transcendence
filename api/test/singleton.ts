import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';
import prisma from 'test/prisma-client';

import { PrismaService } from '@/prisma';

jest.mock('./client', () => ({
  __esModule: true,
  default: mockDeep<PrismaService>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaService>;
