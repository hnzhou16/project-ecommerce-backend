import "reflect-metadata"
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { CLog } from './AppHelper.js'
import gDB from './InitDataSource.js'
import rootRouter from "./routes/index.js";

// 'process.env' object in Node.js holds all environment variables
// When using tools like cross-env (defined in 'dev:start' , your application automatically reads .env files
const SERVER_PORT = process.env.PORT

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

