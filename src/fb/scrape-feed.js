import { setupPage } from './setupPage'
import { Log } from '../utils/log'
import { parseHumanDate } from './dates'
import { getBatch } from './scrape-feed-batch'
import { waitForTabsLimit } from '../utils/browser'

const MAX_RETRY_COUNT = 3

export async function collectPosts({url, browser, dates = []}) {
  const log = Log('collectPosts')
  log('waiting for tab', url)
  await waitForTabsLimit()
  log('go', url)
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
    let log = Log(`BATCH ${url}, #${batchNumber + 1}`)
    let rawPosts = await getBatch(page, !!batchNumber)
    let batchSize = rawPosts.length

    batchNumber++

    if (!batchSize) {
      if (batchRetryCount === MAX_RETRY_COUNT - 1){
        log('waiting before last retry')
        await page.waitForTimeout(5000)
      }
      if (batchRetryCount < MAX_RETRY_COUNT){
        batchRetryCount++
        log(`Batch ${batchNumber} returned 0 posts, will retry, #${batchRetryCount}`)
      }
      else {
        log(`Abort scraping ${url}. Batch returned 0 posts ${MAX_RETRY_COUNT} times.`)
        endReached = true // use maxRetriesReached ?
      }
      continue
    }

    batchRetryCount = 0
    log(`received with ${batchSize} posts`)

    let tooOldPostsCount = 0
    let tooNewPostsCount = 0
    let sponsoredCount = 0
    let evaluationErrorCount = 0
    let timeParsingErrorCount = 0
    let processedCount = 0

    const filteredPosts = rawPosts

      .map((post) => ({
        ...post,
        date: parseHumanDate(post.rawTime),
        sponsored: post?.rawTime?.search(/sponsored/i) > -1
      }))
      .filter(({date, error, id, sponsored}) => {
        let postTooOld = date && date < new Date(minDate)
        let postTooNew = date && maxDate && (new Date(maxDate) < date)
        let postAlreadyProcessed = result.has(id)

        sponsoredCount += sponsored
        evaluationErrorCount += !!error
        timeParsingErrorCount += !date
        tooOldPostsCount += postTooOld
        tooNewPostsCount += postTooNew
        processedCount += postAlreadyProcessed

        if (!date || error || sponsored || postTooOld || postTooNew || postAlreadyProcessed) {
          return
        }

        return true
      })

    // let allBatchIsTooNew = batchSize === tooNewPostsCount + sponsoredCount
    let allBatchIsTooOld = batchSize === tooOldPostsCount + sponsoredCount
    let allBatchIsBroken = batchSize === timeParsingErrorCount + sponsoredCount

    log(
      'BATCH STATS:',
      Object
        .entries({
          good: filteredPosts.length,
          tooOld: tooOldPostsCount,
          tooNew: tooNewPostsCount,
          ads: sponsoredCount,
          err: evaluationErrorCount,
          timeErr: timeParsingErrorCount,
          dupe: processedCount,
        })
        .filter(([,v]) => !!v)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')
    )

    if (allBatchIsTooOld) {
      log('End of requested period reached.')
    }
    if (allBatchIsBroken) {
      log('Something\'s wrong with parsing feed, aborting')
    }
    if (allBatchIsTooOld || allBatchIsBroken){
      endReached = true
    }

    filteredPosts.forEach((post) => {
      result.set(post.id, post)
    })

    log('Total good:', result.size)
  }

  let vals = Array.from(result.values())

  log(`done! Found ${vals.length} posts`)

  await page.close()
  return vals
}
