import type { INestApplication } from '@nestjs/common';
import * as compression from 'compression';

export function middleware(app: INestApplication): INestApplication {
  app.use(compression());
  // app.use(passport.initialize());
  // app.use(passport.session());
  app.enableCors();
  return app;
}
