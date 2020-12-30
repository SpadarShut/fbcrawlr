import fs from 'fs'

export async function setupPage(page, options) {
  const { loadImages } = options
  await page.addScriptTag({path: './build/browser-globals.js'})
  await page.addStyleTag({content: fs.readFileSync('./src/fb/debug-styles.css', 'utf-8')})
  page.on('console', (msg) => {
    // console[msg.type()](...msg.args().map(arg => arg.jsonValue()))
    console[msg.type()](msg.text())
  })
  // if (loadImages === false) {
  //   await page.setRequestInterception(true)
  //   page.on('request', (request) => {
  //     if (['image'/*, 'stylesheet', 'font', 'script'*/].indexOf(request.resourceType()) !== -1) {
  //       request.abort()
  //     }
  //     else {
  //       request.continue()
  //     }
  //   })
  // }
}
