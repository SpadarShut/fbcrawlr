// import puppeteer from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import fetch from 'node-fetch'

puppeteer.use(StealthPlugin())

export async function startBrowser(options = {}) {
  let env_headless = process.env.OPEN_BROWSER !== 'False'

  let {
    headless = env_headless
  } = options

  const browser = await puppeteer.launch({
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })

  return browser
}

let browser
export async function getBrowserInstance() {
  let browserWSEndpoint

  try {
    browserWSEndpoint = await fetch(`http://localhost:${process.env.SERVER_PORT}/browser/ws`).then(r => r.text())
    browser = await puppeteer.connect({ browserWSEndpoint })
  }
  catch (e) {
    if (!browser) {
      console.log('Opening new browser because', e)
      browser = await startBrowser()
    }
  }

  return browser
}
