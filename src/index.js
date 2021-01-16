import dotenv from 'dotenv-yaml'
import { makeValidFilename, saveJson } from './utils/fs'
import { makeMobile } from './fb/links'
import { scrapeURL, setupFacebook } from './fb'
import { parseDates } from './utils/parseDates'
import { Log } from './utils/log'
import { getBrowserInstance } from './utils/browser'

const config = dotenv.config()

const {
  EMAIL,
  PASSWORD,
} = process.env

const {
  OPEN_BROWSER,
  PAGES = [],
  DATES,
  OUTPUT_DIR
} = config.parsed

const log = Log('index.js')
const headless = !OPEN_BROWSER
const browser = await getBrowserInstance({headless})

await setupFacebook({
  page: await browser.newPage(),
  user: EMAIL,
  pass: PASSWORD,
  headless
})

// await page.close()

const dates = parseDates(DATES)
if (!dates) {
  throw new Error('Invalid DATES parameter')
}

const results = PAGES
  .filter(url => !!url)
  .map((url) => {
    url = makeMobile(url)

    return {
      url,
      data: scrapeURL({ url, browser, dates })
    }
  })


await Promise.all(
  results.map(async (res) => {
    let data = await res.data
    let url = new URL(res.url)
    let filename = url.pathname + url.search
    // trim slashes at beginning and end
    filename = filename.replace(/(^\/|\/$)/g, '')
    // replace illegal filename characters
    filename = makeValidFilename(filename)
    filename += '.json'
    filename = `${OUTPUT_DIR || 'output'}/${filename}`

    log('DONE!', res.url, data)

    try {
      return saveJson({ data, filename })
    }
    catch (e) {
      log('Error saving file', filename)
    }
  })
)

// await browser.close()

