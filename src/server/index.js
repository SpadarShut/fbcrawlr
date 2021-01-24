import Koa from 'koa'
import Router from '@koa/router'
import { getBrowserWsEndpoint } from './browser'
import http from 'http'

const {SERVER_PORT} = process.env

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
      process.exit()
    }
  })
  .listen(SERVER_PORT)
