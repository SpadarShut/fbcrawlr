export {
  ensureEnglishUI,
  disableTranslations,
}

async function ensureEnglishUI(page) {
  await page.goto(
    'https://m.facebook.com/language.php',
    {waitUntil: 'networkidle2'}
  ) // https://m.facebook.com/language.php?n=%2Fhome.php
  await page.click('div[value="en_US"]')
  await page.waitForNavigation()
  console.log('ensureEnglishUI: Language EN set')
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
