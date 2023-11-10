import { Module } from '@nestjs/common';

import { UserModule } from '../user';
import { NotifyGateway } from './notify.gateway';
import { NotifyService } from './notify.service';

@Module({
  controllers: [],
  providers: [NotifyGateway, NotifyService],
  imports: [UserModule],
  exports: [NotifyService],
})
export class NotifyModule {}
