import { SELECTORS } from './selectors'
import { setupPage } from './setupPage'

export async function collectPosts({url, browser, dateTo, dateFrom}) {
  console.log('collectPosts: ', url)
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })

  await page.waitForSelector(SELECTORS.feedPost)
  await setupPage(page)
  let posts = await page.$$eval(SELECTORS.feedPost, (posts, SELECTORS) => {
    /* eslint-env browser */
    /* globals __ */
    const log = __.Log('collectPosts')

    log('found posts', posts.length)
    return posts.map(post => {
      let res = {}

      // log('post', post)
      const link = post.querySelector(SELECTORS.postLink)
      const time = post.querySelector(SELECTORS.postTime)
      try {
        let timeRawText = time.innerText.trim()

        res.url = link.href
        // res.time = timeUTC
        res.timeRawText = timeRawText
        res.timeScanned = new Date().getTime()
      }
      catch (e) {
        window.console.log('Error parsing page', {time, link, error: e})
        res.error = e.toString()
      }
      return res
    })
  }, SELECTORS)

  // todo scroll to load next batch

  console.log('Page feed parsed!', page.url())
  return posts
}
