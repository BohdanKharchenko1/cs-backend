import { DataSource } from 'typeorm';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { glob } from 'glob';
import * as dotenv from 'dotenv';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.production.env'
    : '.development.env';
dotenv.config({ path: envFile });

const configService = new ConfigService();
const isCompiled = __dirname.includes('dist');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST'),
  port: configService.get<number>('POSTGRES_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  url: configService.get<string>('DATABASE_URL'),
  entities: glob.sync(
    join(__dirname, '..', '..', '**', `*.entity.${isCompiled ? 'js' : 'ts'}`),
  ),
  migrations: glob.sync(
    join(__dirname, 'migrations', `*.${isCompiled ? 'js' : 'ts'}`),
  ),
  ssl:
    configService.get<string>('NODE_ENV') === 'local'
      ? false
      : { rejectUnauthorized: false },
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: false,
});
