import { SELECTORS } from './selectors'
import { doTwoFactorAuth, isTwoFactorAuthPage } from './two-factor'
import { Log } from '../utils/log'

let login = async (args) => {
  const log = Log('login')
  const {page, user, pass, headless} = args

  await page.goto('https://m.facebook.com', {waitUntil: 'networkidle2'})
  try {
    // if post form is on page, we are logged in
    await page.waitForSelector(SELECTORS.composer, {timeout: 3000})
    return true
  }
  catch (e) {
    log('Trying to log in')
  }

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
  log('Login successful!')
}

export { login }
