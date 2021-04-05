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
  let { page, user, pass } = options
  const browser = await getBrowserInstance(options)
  let _page = page ?? await browser.newPage()

  if (!loggedIn) {
    await setupFacebook({
      page: _page,
      user: user || EMAIL,
      pass: pass || PASSWORD,
      headless: !OPEN_BROWSER
    })
    loggedIn = true

    if (!page) {
      await _page.close()
    }
  }

  return browser
}
