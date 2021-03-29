import { login } from './login'
import { disableTranslations, ensureEnglishUI } from './lang'

export async function setupFacebook(props) {
  const {
    page,
    user,
    pass,
    headless
  } = props

  await login({
    page,
    user,
    pass,
    headless
  })

  const alreadyEnglish = await ensureEnglishUI(page)
  if (!alreadyEnglish) {
    await disableTranslations(page)
  }
}
