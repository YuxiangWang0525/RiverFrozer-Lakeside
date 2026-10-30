import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '../i18n'

export function useLang() {
  const { locale, t } = useI18n()

  const isZh = computed(() => locale.value === 'zh-CN')

  function toggleLocale() {
    const newLocale = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
    setLocale(newLocale)
    locale.value = newLocale
  }

  return { locale, t, isZh, toggleLocale }
}
