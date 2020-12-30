import { setupPage } from './setupPage'
import { Log } from '../utils/log'
import { parseHumanDate } from './dates'
import { getBatch } from './scrape-feed-batch'

const MAX_RETRY_COUNT = 3

export async function collectPosts({url, browser, dates = []}) {
  const log = Log('collectPosts')
  log(url)
  const page = await browser.newPage()
  await page.goto(url, {waitUntil: 'networkidle2'})
  await setupPage(page)
  let result = new Map()
  let endReached = false
  let batchNumber = 0
  let batchRetryCount = 0

  // todo what if dates not passed ?
  const [minDate, maxDate] = dates

  while (!endReached) {
    let rawPosts = await getBatch(page, !!batchNumber)

    batchNumber++

    if (!rawPosts.length) {
      if (batchRetryCount < MAX_RETRY_COUNT){
        console.log(`Batch ${batchNumber - 1} returned 0 posts, will retry`)
        batchRetryCount++
      }
      else {
        endReached = true // use maxRetriesReached ?
      }
      continue
    }

    batchRetryCount = 0
    log(`batch ${batchNumber} received with ${rawPosts.length} posts`)

    rawPosts.some((post) => {
      if (
        post.error ||
        post.rawTime.toLowerCase().startsWith('sponsored')
      ) {
        return
      }

      const {id, rawTime, url} = post
      const time = parseHumanDate(rawTime)

      if (!time) {
        console.log('Couldn\'t parse post time', url)
        return
      }

      if (time < new Date(minDate)) {
        endReached = true
        return true
      }
      if (maxDate && new Date(maxDate) < time){
        return
      }
      if (!result.has(id)) {
        post.time = time
        result.set(id, post)
      }
    })
  }

  let vals = result.values()

  log('done!', url, vals)
  return Array.from(vals)
}
