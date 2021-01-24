import { setupPage } from './setupPage'
import { SELECTORS } from './selectors'
import { Log } from '../utils/log'
import { parseHumanDate } from './dates'
import { makeValidFilename } from '../utils/fs'
import { waitForTabsLimit } from '../utils/browser'

export {
  scrapePost,
  getPostTime,
  getPostText,
}

async function scrapePost({url, browser}) {
  await waitForTabsLimit()

  const log = Log('scrapePost')
  log('Parsing ', url)
  const page = await browser.newPage()
  await page.goto(url, {waitUntil: 'networkidle2'})

  await setupPage(page)

  let text = await getPostText({page})
  let times = await getPostTime({page})

  // Plan:
  // process comment and post likes
  // get post text/ image/ link /repost data
  // load all (?) comments
  // load comment replies
  // load comment reactions
  // load all comments
  // load comment replies
  // attached photo url?

  let reactions = await page.$eval(SELECTORS.postRoot, async (node, { url }) => {
    /* eslint-env browser */
    /* globals __ */
    const { Log, $, $$, SELECTORS } = __
    const log = Log('scrapePost in-page')

    try {
      // let $reactionsLink = $(SELECTORS.postReactions, node)
      let $postShares = $(SELECTORS.postShares, node)
      let $$comments = $$(SELECTORS.postComment, node)

      return {
        // View 1 more comment (added while viewing page)
        // reactionsUrl: $reactionsLink?.href,
        shares: $postShares?.textContent,
        comments: $$comments.map((comm) => ({
          text: $(SELECTORS.postCommentBody, comm).innerText,
          // reactionsUrl: $(SELECTORS.postReactions, comm).href,
          id: comm.dataset.uniqueid
        })),
      }
    }
    catch (error) {
      log(error)
      return {error}
    }
  }, { url })

  let result = {
    url,
    text,
    ...times,
    ...reactions,
  }
  log('done', url)

  await page.close()
  return result
}

async function getPostTime({page}){
  let time = await page.$eval(SELECTORS.postTime, (node) => {
    return node.innerText.trim()
  })
  const now = new Date()

  return {
    timeScanned: now.getTime(),
    timeRaw: time,
    time: parseHumanDate(time, now)
  }
}

async function getPostText({ page } = {}) {
  let log = Log('getPostText')

  try {
    await page.waitForSelector(SELECTORS.postTextRoot)

    return await page.$eval(SELECTORS.postTextRoot, async ($postTextRoot) => {
      const { $, SELECTORS } = __
      const $postCardContent = $(SELECTORS.postCardContent)

      if ($postCardContent) {
        return $postCardContent.innerText
      }

      return $postTextRoot.innerText
    })
  }
  catch (e) {
    log(`Cannot find ${SELECTORS.postTextRoot}`, page.url())
    await page.screenshot({
      path: `${process.env.OUTPUT_DIR}/errors/getPostText-${makeValidFilename(e)}-${Date.now()}.png`
    })
    return null
  }
}
