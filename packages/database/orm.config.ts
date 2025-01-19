import { DataSourceOptions } from 'typeorm';

export default function getConfig() {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/./entities/**/*{.ts,.js}'],
    migrations: [__dirname + '/./migrations/**/*{.ts,.js}'],
    synchronize: false,
  } as DataSourceOptions;
}
