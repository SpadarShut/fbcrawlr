import { Log } from '../utils/log'

export {
  ensureEnglishUI,
  disableTranslations,
}

async function ensureEnglishUI(page) {
  await page.goto(
    'https://m.facebook.com/language.php',
    {waitUntil: 'networkidle2'}
  ) // https://m.facebook.com/language.php?n=%2Fhome.php
  const isEnglishAlready = await page.$eval('#rootcontainer', (el) => {
    return el.innerText.trim().indexOf('English') === 0
  })
  if (isEnglishAlready) {
    return true
  }
  await page.click('div[value="en_US"]')
  await page.waitForNavigation()
  Log('ensureEnglishUI')('Language EN set')
}

async function disableTranslations(page) {
  // do not automatically translate non-english posts
  await page.goto(
    'https://m.facebook.com/settings/language/auto_translate_disabled_dialects/',
    {waitUntil: 'networkidle2'}
  )
  let btnSelector = '.dialectListContainer > [role="button"]'
  let langBtn = await page.$(btnSelector)

  if (!langBtn) {
    console.error('disableTranslations: Cannot find languages to disable')
    return
  }

  while (langBtn) {
    langBtn = await page.$(btnSelector)
    if (!langBtn) {
      break
    }
    try {
      await langBtn.click()
    }
    catch (e) {
      console.log('disableTranslations: Couldn\'t click language ', e)
    }
  }

  await page.waitForRequest(async () => {
    console.log('disableTranslations: submit')
    await page.click('form [type=submit]')
  })

  console.log('disableTranslations: done!')
}
