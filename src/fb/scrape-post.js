import { setupPage } from './setupPage'
import { SELECTORS } from './selectors'
import { Log } from '../utils/log'

export async function scrapePost({url, browser}) {
  const log = Log('scrapePost')
  log('Parsing ', url)
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })
  log('Page opened', url)
  await setupPage(page)
  let result = await page.$eval(SELECTORS.postRoot, (node, {SELECTORS, url}) => {
    /* eslint-env browser */
    /* globals __ */
    const log = __.Log('scrapePost in-page')
    log('In page, hello from kuklavod)', window._u)
    let _url = new URL(url)
    try {

      return {
        timeScanned: new Date().getTime(),
        time: node.querySelector(SELECTORS.postTime).innerText.trim(),
        // todo parse post time and date
        // todo post text
        // todo load all comments
        // todo load comment replies
        url: _url.href,
        reactionsUrl: __.$(SELECTORS.postReactions, node).href,
        shares: __.$(SELECTORS.postShares, node)?.textContent,
        comments: __.$$(SELECTORS.postComment, node).map((comm) => ({
          text: __.$(SELECTORS.postCommentBody, comm).innerText,
          reactionsUrl: __.$(SELECTORS.postReactions, comm).href,
          id: comm.dataset.uniqueid
        })),
      }
    }
    catch (e) {
      log(e)
      alert(e)
    }
  }, {SELECTORS, url})

  // todo process comment and post likes

  log('done', url, result)

  // await page.close()
  return result
}
