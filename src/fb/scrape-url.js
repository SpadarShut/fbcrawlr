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
    .filter(post => !!post.url)
    .forEach(post => {
      result.push(
        scrapePost({
          ...post,
          url: cleanupURL(post.url),
          browser
        })
      )
    })

  result = await Promise.allSettled(result)

  log('done!', url)

  return result
}
