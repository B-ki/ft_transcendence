import type { INestApplication } from '@nestjs/common';
import * as compression from 'compression';
import * as morgan from 'morgan';

export function middleware(app: INestApplication): INestApplication {
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
  }

  app.use(compression());
  // app.use(passport.initialize());
  // app.use(passport.session());
  app.enableCors();

  return app;
}
