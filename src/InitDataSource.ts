import "reflect-metadata"
import * as path from 'path'
import { fileURLToPath } from 'url';
import { CLog } from './AppHelper.js'
import { DataSource, DataSourceOptions } from 'typeorm'

if (!process.env.PORT) {
  await import('dotenv-flow').then((dotenv) => dotenv.config());
}

if (!process.env.DB_FILE) {
  CLog.bad(`Invalid or Missing [Primary] DB Config env, ${process.env.DB_FILE}`)
  process.exit(1)
}

// alert only
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);  // get the name of the directory
const entityPath =
  process.env.ENV === 'production'
    ? path.join(__dirname + '/../../build/src/auth2/entity/**/*.entity.js')
    : path.join(__dirname + '/../src/entity/**/*.entity.ts')
CLog.ok(`Env is: -->${process.env.NODE_ENV}`)
CLog.ok(`Server Path-->${__dirname}`)
CLog.ok(`Entity Path: -->${entityPath}`)
CLog.ok(`DB Info:
[Master]-->${process.env.DB_FILE}
`)

CLog.info(`Seed info: 
   ${process.env.TYPEORM_SEEDING_SEEDS} 
`)

const options: DataSourceOptions = {
  type: 'sqlite',
  ...{
    database: process.env.DB_FILE,
  },

  synchronize: process.env.DB_SYNC.toLowerCase() === 'true',
  extra: { connectionLimit: 50 },
  logging: ['error'],
  maxQueryExecutionTime: 3000, //logging query executing 1 second

  entities: [
    entityPath,
  ],
  migrations: [process.env.MYSQL_MIGRATIONS],
  subscribers: [process.env.MYSQL_SUBSCRIBERS],
}
const gDB = new DataSource(options)
export default gDB
