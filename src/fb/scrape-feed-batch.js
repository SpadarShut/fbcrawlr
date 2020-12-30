import { Log } from '../utils/log'
import { SELECTORS } from './selectors'

export async function getBatch(page, loadMore) {
  const log = Log('getBatch')
  log('start')

  if (loadMore) {
    await scrollToBottom(page)
  }
  else {
    log('waitForSelector(SELECTORS.feedPost)')
    await page.waitForSelector(SELECTORS.feedPost)
  }

  await page.waitForRequest(async () => {
    await scrollToBottom(page)
  })

  return await page.evaluate(() => {
    /* eslint-env browser */
    /* globals __ */
    const {$$, Log, SELECTORS} = __
    // save nodes processed between batches
    let nodesProcessed = __.nodesProcessed || new WeakMap()
    __.nodesProcessed = nodesProcessed
    const resBatch = []
    const log = Log('collectPosts in-page')
    log('start')

    let posts = $$(SELECTORS.feedPost)

    console.log(`total ${posts.length} posts on page`)

    posts.forEach((node) => {
      if (nodesProcessed.has(node)) {
        return
      }
      nodesProcessed.set(node, true)

      let id
      try {
        id = JSON.parse(node.dataset.store).share_id
      }
      catch (e) {
        log('ERROR parsing feed item meta', e)
        return
      }

      if (!resBatch[id]) {
        resBatch[id] = scrapeFeedItem(node, id)
      }
    })

    console.log(`${Object.keys(resBatch).length} posts in batch`)

    return Object.values(resBatch)

    function scrapeFeedItem(node, id) {
      let post = {}
      const link = node.querySelector(SELECTORS.postLink)
      const timeNode = node.querySelector(SELECTORS.postTime)

      try {
        post.id = id
        post.url = link.href
        post.rawTime = timeNode.innerText.trim()
        post.timeScanned = new Date().getTime()
      }
      catch (e) {
        log('Error parsing post', {time: timeNode, link, error: e})
        post.error = e.toString()
      }

      return post
    }
  })
}

async function scrollToBottom(page) {
  Log()('scrollToBottom')
  await page.evaluate(() => {
    const html = document.documentElement
    html.scrollTop = html.scrollHeight
  })
}
