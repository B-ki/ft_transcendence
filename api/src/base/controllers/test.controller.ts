import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  construstor() {}

  @Get('/')
  public getHello(): object {
    return { message: 'Hello World!' };
  }
}
