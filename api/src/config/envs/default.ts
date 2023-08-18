export const config = {
  db: {
    type: process.env.DB_TYPE || 'postgres',
    synchronize: false,
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
  },
};
