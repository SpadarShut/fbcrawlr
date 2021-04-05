import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import fetch from 'node-fetch'
import path from 'path'
import { sleep } from './async'

export {
  getBrowserInstance,
  shouldBrowserStartHeadless,
  startBrowser,
  waitForTabsLimit,
  isTabLimitReached,
}

const {
  SERVER_PORT,
  OPEN_BROWSER,
  MAX_OPEN_TABS,
  TAB_OPEN_INTERVAL
} = process.env

async function startBrowser(options = {}) {
  let {
    headless = shouldBrowserStartHeadless(options.headless)
  } = options

  puppeteer.use(StealthPlugin())
  return puppeteer.launch({
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--lang=en',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
    userDataDir: path.join(process.cwd(), '.user')
  })
}

let browser

async function getBrowserInstance() {
  let browserWSEndpoint
  try {
    let url = `http://localhost:${SERVER_PORT}/browser/ws`
    browserWSEndpoint = await fetch(url).then(r => r.text())
    console.log('Connected to existing browser instance')
    browser = await puppeteer.connect({ browserWSEndpoint })
  }
  catch (e) {
    if (!browser) {
      browser = await startBrowser()
    }
  }

  return browser
}

function shouldBrowserStartHeadless(headless) {
  if (headless !== undefined) {
    return Boolean(headless)
  }
  return ['False', '0'].includes(OPEN_BROWSER)
}

let callQueue = 0
async function waitForTabsLimit() {
  let interval = TAB_OPEN_INTERVAL || 2000
  await sleep(callQueue++ * interval)
  while (await isTabLimitReached()) {
    await sleep(interval)
  }
  callQueue--
}

async function isTabLimitReached(){
  const browser = await getBrowserInstance()
  const pages = await browser.pages()
  const FBTabs = pages.filter(p => p.url().includes('facebook.com')).length
  const reached = FBTabs >= (MAX_OPEN_TABS || 8)

  return reached
}
