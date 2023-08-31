import { Module } from '@nestjs/common';

import { FakeController } from './fake.contoller';

@Module({
  controllers: [FakeController],
})
export class FakeModule {}
