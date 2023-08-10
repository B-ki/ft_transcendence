import type { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import * as compression from 'compression';
import * as passport from 'passport';
import helmet from 'helmet';

export function middleware(app: INestApplication): INestApplication {
  const is_prod = process.env.NODE_ENV === 'production';
  const secret = process.env.SESSION_SECRET as string;

  app.use(compression());
  app.use(
    session({
      secret: secret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: is_prod },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(
    helmet({
      contentSecurityPolicy: is_prod ? undefined : false,
      crossOriginEmbedderPolicy: is_prod ? undefined : false,
    }),
  );
  app.enableCors();
  return app;
}
