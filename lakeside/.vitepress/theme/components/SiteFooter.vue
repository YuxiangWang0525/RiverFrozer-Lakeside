<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import OneSens from './OneSens.vue'

const { t, locale } = useI18n()
const isZh = computed(() => locale.value === 'zh-CN')
</script>

<template>
  <footer class="site-footer">
    <OneSens class="footer-quote" />
    <p class="footer-peace">{{ t('footer.peace') }}</p>

    <div class="footer-divider" />

    <div class="footer-tech">
      <p class="tech-label">{{ t('footer.techStack') }}</p>
      <p class="tech-list">
        <a href="https://vitepress.dev/" target="_blank" rel="noopener">VitePress</a>,
        <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue.js</a>,
        <a href="https://primevue.org/" target="_blank" rel="noopener">PrimeVue</a>,
        <a href="https://vue-i18n.intlify.dev/" target="_blank" rel="noopener">Vue I18n</a>,
        <a href="https://iconify.design/" target="_blank" rel="noopener">Iconify</a>,
        <a href="https://axios-http.com/" target="_blank" rel="noopener">Axios</a>,
        <a href="https://hyperos.mi.com/font" target="_blank" rel="noopener">MiSans</a>
      </p>
      <p class="powered-by" v-html="t('footer.poweredBy')"></p>
    </div>

    <div class="footer-divider" />

    <div class="footer-filings">
      <a
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=37020302372121"
        target="_blank"
        rel="noopener"
        class="filing-link"
      >
        <img src="https://www.beian.gov.cn/img/new/gongan.png" alt="" class="filing-icon" />
        <span>{{ t('footer.gongan') }}</span>
      </a>
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener"
        class="filing-link"
      >
        {{ t('footer.icpCom') }}
      </a>
      <a
        href="https://icp.gov.moe/?keyword=20230525"
        target="_blank"
        rel="noopener"
        class="filing-link"
      >
        {{ t('footer.mengbei') }}
      </a>
    </div>

    <p class="footer-cz88">
      <template v-if="isZh">
        IP地址位置数据由<a href="https://www.cz88.net" target="_blank" rel="noopener">纯真CZ88</a>提供支持
      </template>
      <template v-else>
        IP geolocation data powered by <a href="https://www.cz88.net" target="_blank" rel="noopener">CZ88</a>
      </template>
    </p>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--color-bg-alt);
  border-top: 1px solid var(--color-border);
  padding: 48px 24px 32px;
  text-align: center;
}

.footer-quote {
  font-size: 14px;
  color: var(--color-text-secondary);
  font-style: italic;
  margin-bottom: 8px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.footer-peace {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}

.footer-divider {
  width: 60px;
  height: 1px;
  background: var(--color-aqua-200);
  margin: 24px auto;
}

.footer-tech {
  margin-bottom: 8px;
}

.tech-label {
  font-size: 11px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.tech-list {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.tech-list a {
  color: var(--color-aqua-600);
  transition: color 0.2s ease;
}

.tech-list a:hover {
  color: var(--color-aqua-500);
}

.powered-by {
  font-size: 12px;
  color: var(--color-text-secondary);
  /*font-family: var(--font-mono);*/
}

.footer-filings {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.filing-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
}

.filing-link:hover {
  color: var(--color-aqua-600);
}

.filing-icon {
  width: 14px;
  height: 14px;
}

.footer-cz88 {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 16px;
}

.footer-cz88 a {
  color: var(--color-aqua-600);
}

@media (max-width: 768px) {
  .site-footer {
    padding: 32px 16px 24px;
  }

  .footer-filings {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
