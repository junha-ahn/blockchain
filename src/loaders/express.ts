import * as path from 'path'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as morgan from 'morgan'
import routes from '../api'
import config from '../config'

export default ({ app }: { app: express.Application }) => {
  
  app.use(morgan(config.NODE_ENV == "production" ? "combined" : "dev"));
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(bodyParser.json())
  // Load API routes
  app.use(config.api.prefix, routes())
}
