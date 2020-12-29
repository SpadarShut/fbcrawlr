import fs from 'fs'

export async function setupPage(page) {
  await page.addScriptTag({path: './build/browser-globals.js'})
  await page.addStyleTag({content: fs.readFileSync('./src/fb/debug-styles.css', 'utf-8')})
  page.on('console', (msg) => {
    // console[msg.type()](...msg.args().map(arg => arg.jsonValue()))
    console[msg.type()](msg.text())
  })
}
