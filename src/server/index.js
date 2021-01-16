import path from 'path'
import dotenv from 'dotenv-yaml'
import Koa from 'koa'
import Router from '@koa/router'
import { getBrowserWsEndpoint } from './browser'
import http from 'http'

const env = dotenv.config({path: path.resolve('.env.yml')}).parsed
const {SERVER_PORT} = env

const app = new Koa()
const router = new Router()

router
  .get('/browser/ws', getBrowserWsEndpoint)

app
  .use(router.routes())
  .use(router.allowedMethods())

const okTimeout = setTimeout(() => {
  console.log(`Server started on port ${SERVER_PORT}`)
}, 1000)

http
  .createServer(app.callback())
  .on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      clearTimeout(okTimeout)
      console.log(`Server was already running on port ${SERVER_PORT}`)
    }
  })
  .listen(SERVER_PORT)
