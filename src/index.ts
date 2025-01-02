//
//--------------------------------------
//

//
// 1 upgrade TypeORM from v0.2.44 to v0.3.10
// 2. transfer DB connection from createConnection to DataSource mode
// 3. upgrade other packages to the latest version
// 4. start to use compiled JS in Production mode to optimize the execution time

//
//--------------------------------------
//

import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { UserEntity } from './entity/User.entity'

import 'reflect-metadata'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { CLog } from './AppHelper'
import gDB from './InitDataSource'
import cors = require('cors')
import rootRouter from "./routes";

const MAX_UPLOAD_FILE_SIZE = 50

// 'process.env' object in Node.js holds all environment variables
// When using tools like cross-env (defined in 'dev:start' , your application automatically reads .env files
const SERVER_PORT = process.env.PORT

// async function allow you to use 'await' inside, don't need to use '.then' to handle promise
const startServer = async () => {
  try {
    await gDB.initialize()
    CLog.ok('Data Source has been initialized!')

    // create express app
    // Express - a web framework for handling HTTP requests and building APIs.
    const app = express() // http server
    app.disable('x-powered-by')

    // setup express app (middleware)
    app.use(bodyParser.json())
    app.use(cors())
    app.use('/', rootRouter)

    // start express server
    const server = app.listen(SERVER_PORT)

    // socket io
    CLog.ok(
      `NODE_ENV is : ${process.env.NODE_ENV}.\n Express server has started on port ${SERVER_PORT}.`,
    )
  } catch (err) {
    CLog.bad('Error Server Initializing...', err)
    process.exit(1)
  }
}

startServer()
