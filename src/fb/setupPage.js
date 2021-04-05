// import fs from 'fs'

export async function setupPage(page, options = {}) {
  const {
    loadImages = true,
  } = options
  await page.addScriptTag({path: './build/browser-globals.js'})
  // await page.addStyleTag({content: fs.readFileSync('./src/fb/debug-styles.css', 'utf-8')})

  page.on('console', (msg) => {
    let text = msg.text()
    if (text.includes('net::ERR_FAILED') && loadImages === false) {
      return
    }
    console[msg.type()](text)
  })

  if (loadImages === false) {
    await page.setRequestInterception(true)
    const blockResources = [
      'image',
      'imageset',
      'media',
      'font',
      'textrack',
      'object',
      'beacon',
      'csp_report',
    ]
    page.on('request', (request) => {
      if (
        blockResources.indexOf(request.resourceType()) !== -1 ||
        request.url().match(/\.((jpe?g)|png|gif)/) != null
      ) {
        request.abort()
      }
      else {
        request.continue()
      }
    })
  }
}
