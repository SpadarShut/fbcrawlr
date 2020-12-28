import { SELECTORS } from './selectors'

export async function parsePost({url, browser}) {
  console.log('Parsing ', url)
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })
  console.log('Page opened', url)
  await page.addScriptTag({path: './utils/browser.js', type: 'module'})
  let result = await page.$eval(SELECTORS.postRoot, (node, {SELECTORS, url}) => {
    /* eslint-env browser */
    /* globals $, $$ */
    window.console.log('In page, hello from kuklavod)', window._u)
    let _url = new URL(url)
    try {

      return {
        timeScanned: new Date().getTime(),
        time: node.querySelector(SELECTORS.postTime).innerText.trim(),
        // todo parse post time and date
        // todo post text
        // todo load all comments?
        url: _url.href,
        reactionsUrl: $(SELECTORS.postReactions, node).href,
        shares: $(SELECTORS.postShares, node)?.textContent,
        comments: $$(SELECTORS.postComment, node).map((comm) => ({
          text: $(SELECTORS.postCommentBody, comm).innerText,
          reactionsUrl: $(SELECTORS.postReactions, comm).href,
          id: comm.dataset.uniqueid
        })),
      }
    }
    catch (e) {
      console.log(e)
      alert(e)
    }
  }, {SELECTORS, url})

  // todo process comment and post likes

  console.log('Page parsing done:', url, result)

  // await page.close()
  return result
}
