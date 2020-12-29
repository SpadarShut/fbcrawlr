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

  await ensureEnglishUI(page)
  // todo only run once for user
  await disableTranslations(page)
}
