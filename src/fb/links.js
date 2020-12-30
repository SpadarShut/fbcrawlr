export function cleanupURL(url) {
  const _url = new URL(url);
  ['refid', 'anchor_composer'].forEach((key) => {
    _url.searchParams.delete(key)
  })
  _url.searchParams.forEach((value, key, parent) => {
    if (key.indexOf('_') === 0) {
      parent.delete(key)
    }
  })

  return _url.href
}

export function isSinglePostURL(url) {
  const _url = new URL(url)

  return [
    () => _url.pathname.includes('/story.php'),
    () => _url.pathname.includes('/photo.php'),
    () => _url.pathname.includes('/permalink'),
    () => _url.pathname.includes('/posts/'),
    // this is permalink for photo.php:
    // https://www.facebook.com/adarkay/posts/3821912454528271
  ].some(fn => fn())
}
// photo.php?fbid=10222119341966165&id=1641428044&set=a.1526006283716&source=57

export function makeMobile(_url) {
  let url = new URL(_url, 'https://m.facebook.com')
  url.hostname = 'm.facebook.com'

  return url.href
}

function getUidFromLink(url = '') {
  let match = url.match(/\/permalink\/(\d+)/)
  if (match){
    return match[1]
  }

  const {pathname, searchParams} = new URL(url)

  // story_fbid
  if (searchParams.has('fbid')) {

  }
}
