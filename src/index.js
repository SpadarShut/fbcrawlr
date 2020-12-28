import puppeteer from 'puppeteer'
import dotenv from 'dotenv-yaml'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { prepareURL } from './utils/url'
import { saveJson } from './utils/fs'
import { login } from './fb/login'
import { cleanupURL, isSinglePostURL } from './fb/links'
import { disableTranslations, ensureEnglishUI } from './fb/lang'
import { collectPosts, parsePost } from './fb'
import { setupPage } from './fb/setupPage'

const config = dotenv.config()
const argv = yargs(hideBin(process.argv)).argv
const { code } = argv
const {
  EMAIL: user,
  PASSWORD: pass,
} = process.env
const {
  OPEN_BROWSER,
  PAGES = [],
} = config.parsed;

(async () => {
  let headless = !OPEN_BROWSER
  const browser = await puppeteer.launch({
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })
  const [page] = await browser.pages()

  await login({
    page,
    user,
    pass,
    code,
    headless
  })

  await ensureEnglishUI(page)
  // todo only run once for user
  // await disableTranslations(page)

  const results = PAGES
    .filter(url => !!url)
    .map((url) => {
      url = prepareURL(url)

      return {
        url,
        data: scrapeURL({ url, browser })
      }
    })

  // page.close()

  await Promise.all(
    results.map(async (res) => {
      let data = await res.data
      let filename = new URL(res.url).pathname.substring(1).replace(/:\?\//, '_')
      filename = `output/${filename}.json`

      console.log('DONE!', res.url, data)

      return saveJson({ data, filename })
    }))

  // await browser.close()
})()

async function scrapeURL(opts) {
  const { url, browser, dateFrom, dateTo } = opts
  console.log('scrapeURL: start scraping ', url)
  let que = []
  let result = []

  if (isSinglePostURL(url)){
    result.push(parsePost({ url, browser }))
  }
  else {
    que = await collectPosts({ url, browser, dateTo, dateFrom })
  }

  console.log('Awaiting parsing queue')

  que
    .filter(page => !!page.url)
    .slice(0,1)
    .forEach(page => {
      result.push(
        parsePost({
          ...page,
          url: cleanupURL(page.url),
          browser
        })
      )
    })

  result = await Promise.all(result)

  console.log('Scraping page done!', url)

  return result
}
