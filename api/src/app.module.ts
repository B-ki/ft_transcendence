import { Logger, Module } from '@nestjs/common';
import { UserModule } from './modules/user';
import { AuthModule } from './modules/auth';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';

@Module({
  imports: [
    UserModule,
    AuthModule,
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
