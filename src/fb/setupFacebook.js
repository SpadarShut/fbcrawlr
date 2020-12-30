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

  // todo only run once for user
  // await ensureEnglishUI(page)
  // await disableTranslations(page)
}
