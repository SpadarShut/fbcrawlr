import { SELECTORS } from './selectors'
import { getConsoleInput } from '../utils/console'

async function doTwoFactorAuth({page, headless}) {

  // notifications alert ?
  // todo unsubscribe ?
  page.once('dialog', async dialog => {
    console.log(dialog.message())
    await dialog.dismiss()
  })
  if (isTwoFactorAuthPage(page)) {
    let success = false
    if (headless) {
      while (!success) {
        console.log('Will try console code')
        success = await tryCodeFromConsole(page)
      }
    }
    else {

      // todo wait till user enters code
      while (isTwoFactorAuthPage(page)) {
        await page.click(SELECTORS.twoFactorCodeInput)
        await page.waitForNavigation()
        console.log('nav done')
      }
    }

    if (isTwoFactorAuthPage(page)) {
      if (await page.waitForSelector(SELECTORS.twoFactorCodeInput, {timeout: 0})) {
        console.log('Two-factor auth failed, tried code ')
      } else {
        console.log('Two factor code OK')

        await page.$eval('form', (form) => {
          form.submit()
        })
        console.log('Logged in')
      }
      await page.waitForNavigation()

      if (page.url().match('/checkpoint')) {
        await page.click(SELECTORS.checkpointSubmit)
        await page.waitForNavigation()
      }
      console.log('Auth done!')
    }
  }
}

async function tryCodeFromConsole(page) {
  await page.waitForSelector(SELECTORS.twoFactorCodeInput)
  let code = await getConsoleInput('Enter two-factor auth code:')
  await page.type(SELECTORS.twoFactorCodeInput, code)
  await page.click(SELECTORS.checkpointSubmit)
  console.log('Two factor code submitted', code)
  await page.waitForNavigation()

  return isCodeSubmitOk(page)
}

async function isCodeSubmitOk(page) {
  // if after reload the input is still in dom, then code failed
  const codeOk = await page.waitForSelector(SELECTORS.twoFactorCodeInput, {
    hidden: true,
    timeout: 0
  })

  return codeOk === null
}

function isTwoFactorAuthPage(page) {
  return !!page.url().match('/checkpoint')
}

export {
  doTwoFactorAuth,
  isTwoFactorAuthPage,
}
