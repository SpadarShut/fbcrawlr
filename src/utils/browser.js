// import puppeteer from 'puppeteer'

import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

export async function startBrowser(headless) {
  const browser = await puppeteer.launch({
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })
  const [page] = await browser.pages()

  return [browser, page]
}
