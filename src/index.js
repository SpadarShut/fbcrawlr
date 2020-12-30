import dotenv from 'dotenv-yaml'
import { saveJson } from './utils/fs'
import { makeMobile } from './fb/links'
import { scrapeURL, setupFacebook } from './fb'
import { parseDates } from './utils/parseDates'
import { Log } from './utils/log'
import { startBrowser } from './utils/browser'

const config = dotenv.config()
const {
  EMAIL: user,
  PASSWORD: pass,
} = process.env
const {
  OPEN_BROWSER,
  PAGES = [],
  DATES
} = config.parsed

;(async () => {
  const log = Log('index.js')
  const headless = !OPEN_BROWSER
  const [ browser, page ] = await startBrowser(headless)
  await setupFacebook({
    page,
    user,
    pass,
    headless
  })

  const dates = parseDates(DATES)
  const results = PAGES
    .filter(url => !!url)
    .map((url) => {
      url = makeMobile(url)

      return {
        url,
        data: scrapeURL({ url, browser, dates })
      }
    })

  await page.close()

  await Promise.all(
    results.map(async (res) => {
      let data = await res.data
      let filename = new URL(res.url).pathname.substring(1).replace(/:\?\//, '_')
      filename = `output/${filename}.json`

      log('DONE!', res.url, data)

      return saveJson({ data, filename })
    }))

  // await browser.close()
})()

