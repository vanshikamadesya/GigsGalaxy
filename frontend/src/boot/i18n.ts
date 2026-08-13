import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export type MessageLanguages = keyof typeof messages
export type MessageSchema = (typeof messages)['en-US']

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
}

export default defineBoot(({ app }) => {
  const i18n = createI18n({
    locale: localStorage.getItem('gg_locale') || 'en-US',
    fallbackLocale: 'en-US',
    globalInjection: true,
    messages
  })
  app.use(i18n)
})
