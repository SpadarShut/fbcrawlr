
export function prepareURL(_url){
  let url = new URL(_url, 'https://m.facebook.com')
  url.hostname = 'm.facebook.com'

  return url.href
}
