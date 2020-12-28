import fs from 'fs'

export async function setupPage(page) {
  await page.addScriptTag({path: './build/browser-globals.js'/*, type: 'module'*/})
  await page.addStyleTag({content: fs.readFileSync('./src/fb/debug-styles.css', 'utf-8')})
}
