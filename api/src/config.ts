export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    expiringTime: 24 * 60 * 60,
  },
  app42: {
    id: process.env.APP_ID,
    secret: process.env.APP_SECRET,
  },
  app: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    frontPort: process.env.FRONT_PORT || 80,
  },
  swagger: {
    enabled: true,
    title: 'Transcendence API Documentation',
    description: 'The API documentation for the ft_transcendence website',
    version: '1.0',
  },
} as const;
