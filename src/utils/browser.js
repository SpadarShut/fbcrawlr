import puppeteer from 'puppeteer'

export async function startBrowser(headless) {
  const browser = await puppeteer.launch({
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  })
  const [page] = await browser.pages()

  return [browser, page]
}
