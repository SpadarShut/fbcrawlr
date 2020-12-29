import { SELECTORS } from './selectors'
import { doTwoFactorAuth, isTwoFactorAuthPage } from './two-factor'

let login = async (args) => {
  const {page, user, pass, headless} = args
  await page.goto('https://facebook.com', {
    waitUntil: 'networkidle2'
  })
  await page.waitForSelector(SELECTORS.login)
  await page.type(SELECTORS.login, user)
  await page.type(SELECTORS.pass, pass)
  await page.$eval('form', (form) => {
    form.submit()
  })
  await page.waitForNavigation()
  if (isTwoFactorAuthPage(page)){
    await doTwoFactorAuth({ page, headless })
  }
  console.log('Login successful!')
}

export { login }
