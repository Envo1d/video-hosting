require('dotenv').config({ quiet: true })
process.env.NODE_CONFIG_DIR ||= require('node:path').resolve(__dirname, '../../config')
import config from 'config'
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import path from 'node:path'

const postgresConfig = config.get<{
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}>('postgresConfig');

export const AppDataSource = new DataSource({
  ...postgresConfig,
  type: 'postgres',
  synchronize: config.get<string>('nodeEnv') === 'development',
  logging: false,
  entities: [path.join(__dirname, '../entities/**/*.entity{.ts,.js}').replace(/\\/g, '/')],
  migrations: [path.join(__dirname, '../migrations/**/*{.ts,.js}').replace(/\\/g, '/')],
  subscribers: [path.join(__dirname, '../subscribers/**/*{.ts,.js}').replace(/\\/g, '/')],
});
