import { Logger, Module } from '@nestjs/common';
import { loggingMiddleware, PrismaModule } from 'nestjs-prisma';

import { AuthModule } from './modules/auth';
import { ChatModule } from './modules/chat';
import { FakeModule } from './modules/fake';
// import { GameModule } from './modules/game';
import { UserModule } from './modules/user';

@Module({
  imports: [
    UserModule,
    AuthModule,
    FakeModule,
    ChatModule,
    // GameModule,
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
