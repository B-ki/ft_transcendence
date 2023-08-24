import { Logger, Module } from '@nestjs/common';
import { loggingMiddleware, PrismaModule } from 'nestjs-prisma';

import { AuthModule } from './modules/auth';
import { FakeModule } from './modules/fake';
import { UserModule } from './modules/user';

@Module({
  imports: [
    UserModule,
    AuthModule,
    FakeModule,
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaClient'),
            logLevel: 'log',
          }),
        ],
      },
    }),
  ],
})
export class AppModule {}
