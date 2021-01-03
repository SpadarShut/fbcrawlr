import { Log } from '../utils/log'

export async function getBatch(page) {
  await triggerLoadingBatch(page)
  return scrapePage(page)
}

async function scrapePage(page) {
  const log = Log('scrapePage')
  log('start')

  return page.evaluate(() => {
    /* eslint-env browser */
    /* globals __ */
    const {$$, Log, SELECTORS} = __
    // save nodes processed between batches
    const nodesProcessed = __.nodesProcessed || new WeakMap()
    __.nodesProcessed = nodesProcessed
    const resBatch = []
    const log = Log('collectPosts in-page')
    const posts = $$(SELECTORS.feedPost)

    log(`total ${posts.length} posts on page`)

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
      else {
        log('ID already scraped', id)
      }
    })

    log(`Done. ${Object.keys(resBatch).length} posts in batch`)

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

export async function triggerLoadingBatch(page) {
  return page.evaluate(() => {
    __.Log('triggerLoadingBatch')('start')
    return new Promise((resolve, reject) => {
      let html = document.documentElement

      html.scrollTop = html.scrollHeight
      let timerId = setInterval(() => {
        if (html.scrollHeight - html.scrollTop > 300) {
          cleanup()
          resolve(html.scrollHeight)
        }
      }, 1000)

      let timeoutId = setTimeout(() => {
        cleanup()
        reject('Aborted waiting for new content after 20 seconds')
      }, 20000)

      function cleanup() {
        clearInterval(timerId)
        clearTimeout(timeoutId)
      }
    })
  })
}
