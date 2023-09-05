import type { INestApplication } from '@nestjs/common';
import * as compression from 'compression';

export function middleware(app: INestApplication): INestApplication {
  if (process.env.NODE_ENV === 'development') {
    // Didn't manage to use es6 modules import here
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const morgan = require('morgan');
    app.use(morgan('dev'));
  }

  app.use(compression());
  // app.use(passport.initialize());
  // app.use(passport.session());
  app.enableCors();

  return app;
}
