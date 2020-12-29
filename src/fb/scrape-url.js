import { Log } from '../utils/log'
import { cleanupURL, isSinglePostURL } from './links'
import { collectPosts } from './scrape-feed'
import { scrapePost } from './scrape-post'

export async function scrapeURL(opts) {
  const {url, browser, dates} = opts
  const log = Log('scrapeURL')
  let que = []
  let result = []

  log('start', url)

  if (isSinglePostURL(url)) {
    result.push(scrapePost({url, browser, dates}))
  }
  else {
    que = await collectPosts({url, browser, dates})
  }

  log('Awaiting parsing queue')

  que
    .filter(page => !!page.url)
    .slice(0, 1)
    .forEach(page => {
      result.push(
        scrapePost({
          ...page,
          url: cleanupURL(page.url),
          browser
        })
      )
    })

  result = await Promise.all(result)

  log('done!', url)

  return result
}
