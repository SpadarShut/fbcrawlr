import dotenv from 'dotenv-yaml'
import { getFilenameFromUrl, saveJson } from './utils/fs'
import { makeMobile } from './fb/links'
import { scrapeURL } from './fb'
import { parseDates } from './utils/parseDates'
import { Log } from './utils/log'
import { getBrowserAndSetupFB } from './utils/fb'

console.log('SCRAPING BEGIN')

const config = dotenv.config().parsed

const {
  PAGES = [],
  DATES,
  OUTPUT_DIR = 'output',
  CLOSE_BROWSER_WHEN_DONE
} = config

const dates = parseDates(DATES)
if (!dates) {
  // todo check if all dates are in future
  throw new Error('Invalid DATES parameter')
}

if (!PAGES) {
  throw new Error('Provide pages to scrape in .env.yml')
}

const browser = await getBrowserAndSetupFB()

const log = Log('index.js')

const results = PAGES
  .filter(url => !!url)
  .map((url) => {
    url = makeMobile(url)

    return {
      url,
      data: scrapeURL({url, browser, dates})
    }
  })

Promise
  .allSettled(results.map(async (res) => {
    let result = await res.data
    let data = result.map(({status, value, reason}) => {
      return status === 'fulfilled' ?
        value :
        {error: reason}
    })
    let filename = `${OUTPUT_DIR}/${getFilenameFromUrl(res.url)}.json`

    log('DONE!', res.url, data)

    try {
      await saveJson({data, filename})
      log(`Saved results for ${res.url} in file ${filename}`)
    }
    catch (e) {
      log('Error saving file', filename)
    }
  }))
  .then(() => {
    log(`ALL SCRAPING DONE. See results in ./${OUTPUT_DIR}/`)
  })
  .catch (e => {
    log('ERROR SCRAPING:', e)
  })




if (CLOSE_BROWSER_WHEN_DONE) {
  await browser.close()
}

