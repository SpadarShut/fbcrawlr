import puppeteer from 'puppeteer'
import dotenv from 'dotenv-yaml'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { prepareURL } from './utils/url.js'
import { SELECTORS } from './fb/selectors'
import { saveJson } from './utils/utils/fs'
import { login } from './fb/login'

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
  const page = await browser.newPage()

  await login({
    page,
    user,
    pass,
    code,
    headless
  })

  const results = PAGES
    .filter(url => !!url)
    .map((url) => {
      return scrape({
        url: prepareURL(url),
        browser
      })
    })

  await Promise.all(
    results.map(async (_page) => {
      const page = await _page

      return saveJson({
        data: page.posts,
        filename: `output/${new URL(page.url).pathname}.json`
      })
    }))

  await browser.close()
})()

async function scrape(opts) {
  const { url, browser } = opts
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })
  // todo detect if this is a single post or story stream
  await page.waitForSelector(SELECTORS.post)
  let posts = await page.$$eval(SELECTORS.postLink, (posts) => {
    return posts.map(a => a.href)
  })
  let postsData = await Promise.all(
    posts.slice(0, 1).map(url => parsePost({
      url,
      browser
    }))
  )
  console.log('All parsed!')
  const result = {
    url,
    posts: postsData
  }

  return result
}

async function parsePost({url, browser}) {
  console.log('Parsing ', url)
  const page = await browser.newPage()
  await page.goto(url)
  await page.waitForNavigation()
  // console.log(url, 'waiting for selector')
  // await page.waitForSelector(SELECTORS.post)
  // todo
  const result = await page.$eval(SELECTORS.post, (node, SELECTORS) => {
    console.log('In page, hello from kuklavod)')
    let _url = URL(url)
    _url.search = ''

    return {
      parseTime: new Date().getTime(),
      url: _url.href,
      commentsCount: parseInt(node.querySelector(SELECTORS.commentsToken).textContent),
      sharedCount: parseInt(node.querySelector(SELECTORS.sharedTokenNode).textContent)
    }
  }, SELECTORS)

  console.log('parsing done:', result)

  await page.close()
  return result
}
