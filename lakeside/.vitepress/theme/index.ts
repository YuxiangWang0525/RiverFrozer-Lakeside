import Layout from './Layout.vue'
import type { Theme } from 'vitepress'
import i18n from './i18n'
import PrimeVue from 'primevue/config'
import { Icon } from '@iconify/vue'
import './style.css'

export default {
  Layout,
  enhanceApp({ app }) {
    app.use(i18n)
    app.use(PrimeVue, {
      unstyled: true,
      license: 'eyJpZCI6IjU5MGQ5OTcyLTEyNmYtNDhkZi1iYWIwLTg5MDg1MWU2MzkzOCIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTMxNzgyNzUsImV4cCI6MTgyNDcxNDI3NX0.vchm5gwlSDdepzRsqsYPlu3bfckQLhI0_U36mcaMo8dfPwJ-Jn-piFEHx1eF9QJAWAPmNqlRxJ1MNbEXVoPNBg',
    })
    app.component('Icon', Icon)
  },
} satisfies Theme
