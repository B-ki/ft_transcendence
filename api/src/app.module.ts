import { ConfigModule } from '@nestjs/config';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE, RouterModule } from '@nestjs/core';

import { config } from '@/config';
import { BaseModule } from '@/base';
import { CommonModule, ExceptionsFilter } from '@/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    // TODO: Add Databse Module once ORM is chosen
    // TODO: Add Logger Module once done
    CommonModule,
    BaseModule,
    RouterModule.register([
      {
        path: 'api',
        module: BaseModule,
      },
    ]),
  ],
  providers: [
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
