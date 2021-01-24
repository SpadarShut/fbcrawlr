import { setupFacebook } from '../fb'
import { getBrowserInstance } from './browser'

export {
  getBrowserAndSetupFB
}

const {
  EMAIL,
  PASSWORD,
  OPEN_BROWSER
} = process.env

let loggedIn = false

async function getBrowserAndSetupFB(options = {}) {
  const { page, user, pass } = options
  const browser = await getBrowserInstance(options)

  if (!loggedIn) {
    await setupFacebook({
      page: page || await browser.newPage(),
      user: user || EMAIL,
      pass: pass || PASSWORD,
      headless: !OPEN_BROWSER
    })
    loggedIn = true
  }

  return browser
}
