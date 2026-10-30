import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

function detectLocale(): string {
  if (typeof window === 'undefined') return 'zh-CN'
  const path = window.location.pathname
  if (path.startsWith('/en/') || path.startsWith('/en.html')) return 'en-US'
  const stored = localStorage.getItem('lang')
  if (stored && messages[stored]) return stored
  if (navigator.language?.startsWith('zh')) return 'zh-CN'
  return 'en-US'
}

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'zh-CN',
  messages,
})

export default i18n

export function setLocale(locale: string) {
  i18n.global.locale.value = locale
  if (typeof window !== 'undefined') {
    localStorage.setItem('lang', locale)
  }
}
