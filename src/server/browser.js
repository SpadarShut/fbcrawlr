import { startBrowser } from '../utils/browser'

export { getBrowserWsEndpoint }

let browser

async function getBrowserWsEndpoint(ctx, next) {
  console.log('browser.js getBrowserWsEndpoint ', )
  if (!browser) {
    browser = (await startBrowser())
  }

  ctx.body = browser.wsEndpoint()

  next()
}
