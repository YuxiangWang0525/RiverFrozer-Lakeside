<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { ref as vueRef } from 'vue'
import axios from 'axios'
import { useLineAnimation } from '../composables/useLineAnimation'

const { t, locale } = useI18n()
const isZh = computed(() => locale.value === 'zh-CN')

const containerRef = ref<HTMLElement | null>(null)
useLineAnimation(containerRef, { stagger: 100 })

const friendLinks = ref<{ name: string; url: string; introduce: string }[]>([])
const friendLinksLoaded = ref(false)
const showExchangeModal = ref(false)

onMounted(async () => {
  try {
    const res = await axios.get('https://nativeapi.yuxiangwang0525.com/personalpage/getFrendLinks')
    friendLinks.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    console.error('Failed to fetch friend links:', err)
    friendLinks.value = []
  } finally {
    friendLinksLoaded.value = true
  }
})

const mailtoLink = computed(() => {
  const subject = encodeURIComponent('申请友情链接')
  const body = encodeURIComponent(
    `链接：\n介绍：\n名称：\n图标：`
  )
  return `mailto:riverfrozer@riverfrozer.me?subject=${subject}&body=${body}`
})

const socialLinks = [
  { name: 'Bilibili', url: 'https://space.bilibili.com/480067936', icon: 'ri:bilibili-fill' },
  { name: 'GitHub', url: 'https://github.com/YuxiangWang0525', icon: 'mdi:github' },
  { name: 'Steam', url: 'https://steamcommunity.com/id/YuxiangWang_0525/', icon: 'mdi:steam' },
  { name: 'NPM', url: 'https://www.npmjs.com/~yuxiangwang_0525', icon: 'jam:npm' },
]

const devLinks = [
  { name: isZh.value ? '博客' : 'Blog', url: '/blog/', icon: 'mdi:pencil', internal: true },
  { name: 'Wiki', url: 'https://wiki.yuxiangwang0525.com/', icon: 'mdi:book-open-variant' },
  { name: 'VitePress Mizuki', url: 'https://mizukitheme.moedigital.org', icon: 'mdi:palette' },
  { name: 'Pomelo', url: 'https://github.com/yuxiangWang0525/pomelo/', icon: 'mdi:fruit-cherries' },
  { name: 'MCBBS Reborn', url: 'https://mcbbs-reborn.aismc.bid/', icon: 'mdi:minecraft' },
]
</script>

<template>
  <section class="links-section" ref="containerRef">
    <div class="links-header">
      <h2 class="links-title" v-html="t('links.title')"></h2>
    </div>
    <div class="links-grid">
      <div class="link-group line-animate-item">
        <h3 class="group-title">{{ t('links.social') }}</h3>
        <div class="card-row">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            class="link-card"
            rel="noopener"
          >
            <Icon :icon="link.icon" class="card-icon" />
            <span class="card-name">{{ link.name }}</span>
          </a>
        </div>
      </div>

      <div class="link-group line-animate-item">
        <h3 class="group-title">{{ t('links.developer') }}</h3>
        <div class="card-row">
          <template v-for="link in devLinks" :key="link.name">
            <a
              v-if="!link.internal"
              :href="link.url"
              target="_blank"
              class="link-card"
              rel="noopener"
            >
              <Icon :icon="link.icon" class="card-icon" />
              <span class="card-name">{{ link.name }}</span>
            </a>
            <a
              v-else
              :href="link.url"
              class="link-card"
            >
              <Icon :icon="link.icon" class="card-icon" />
              <span class="card-name">{{ link.name }}</span>
            </a>
          </template>
        </div>
      </div>

      <div class="link-group line-animate-item" v-if="friendLinksLoaded">
        <h3 class="group-title">{{ t('links.friendlinks') }}</h3>
        <div class="card-row">
          <a
            v-for="link in friendLinks"
            :key="link.name"
            :href="`/departure/?url=${encodeURIComponent(link.url)}&name=${encodeURIComponent(link.name)}`"
            class="link-card"
            :title="link.introduce"
          >
            <Icon icon="mdi:link-variant" class="card-icon" />
            <span class="card-name">{{ link.name }}</span>
          </a>
          <button class="link-card add-link-btn" @click="showExchangeModal = true">
            <Icon icon="mdi:plus" class="card-icon" />
          </button>
        </div>
      </div>
    </div>

    <Transition name="modal-pop">
      <div v-if="showExchangeModal" class="modal-overlay" @click.self="showExchangeModal = false">
        <div class="exchange-modal">
          <h2 class="modal-title">{{ t('links.exchange.title') }}</h2>
          
          <div class="modal-section">
            <h3 class="section-title">{{ t('links.exchange.requirements') }}</h3>
            <ol class="requirements-list">
              <li>
                <span class="req-highlight">{{ t('links.exchange.req1Prefix') }}</span>{{ t('links.exchange.req1') }}
              </li>
              <li>{{ t('links.exchange.req2') }}</li>
              <li>{{ t('links.exchange.req3') }}</li>
              <li>{{ t('links.exchange.req4') }}</li>
            </ol>
          </div>

          <div class="modal-section">
            <h3 class="section-title">{{ t('links.exchange.info') }}</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">{{ t('links.exchange.siteLink') }}：</span>
                <div class="info-content">
                  <code>yuxiangwang0525.com</code>
                  <span class="info-note">{{ t('links.exchange.siteLinkNote') }}</span>
                </div>
                <div class="info-content">
                  <code>riverfrozer.me</code>
                  <span class="info-note">{{ t('links.exchange.siteLinkNote2') }}</span>
                </div>
              </div>
              <div class="info-item">
                <span class="info-label">{{ t('links.exchange.siteIntro') }}：</span>
                <span class="info-value">I don't want to package myself, I just want to truly do something practical.</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ t('links.exchange.siteName') }}：</span>
                <span class="info-value">晚江右海的个人网站</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ t('links.exchange.siteIcon') }}：</span>
                <div class="info-content">
                  <code>yuxiangwang0525.com/avatar.svg</code>
                </div>
                <div class="info-content">
                  <code>riverfrozer.me/avatar.svg</code>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-section mail-section">
            <p class="mail-text">{{ t('links.exchange.mailTo') }}：</p>
            <a :href="mailtoLink" class="mail-link">
              <Icon icon="mdi:email-outline" width="18" />
              riverfrozer@riverfrozer.me
            </a>
          </div>

          <button class="modal-close" @click="showExchangeModal = false">
            {{ t('links.exchange.close') }}
          </button>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.links-section {
  padding: 80px 0;
  max-width: 900px;
  margin: 0 auto;
}

.links-header {
  width: 100%;
  max-width: 1200px;
  padding: 0 40px 32px;
}

.links-title {
  font-size: 28px;
  font-weight: 400;
  color: var(--color-text-primary);
  text-align: left;
  margin: 0;
}

.links-title :deep(.underline) {
  text-decoration: underline;
  text-decoration-color: var(--color-aqua-400);
  text-decoration-thickness: 3px;
  text-underline-offset: 4px;
}

.links-grid {
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 0 24px;
}

.group-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-aqua-700);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 16px;
}

.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.link-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.link-card:hover {
  border-color: var(--color-aqua-400);
  background: var(--color-aqua-50);
  color: var(--color-aqua-700);
}

.add-link-btn {
  padding: 10px 14px;
  border-style: dashed;
}

.add-link-btn:hover {
  border-style: solid;
}

.card-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.card-name {
  white-space: nowrap;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
}

.exchange-modal {
  background: #fff;
  border-radius: 16px;
  padding: 40px 48px;
  max-width: 640px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  margin: 0 0 28px;
}

.modal-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-aqua-700);
  margin: 0 0 12px;
}

.requirements-list {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.8;
  color: #444;
}

.requirements-list li {
  margin-bottom: 8px;
}

.req-highlight {
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: var(--color-aqua-400);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.info-label {
  font-weight: 600;
  color: #333;
}

.info-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.info-content code {
  background: var(--color-aqua-50);
  color: var(--color-aqua-700);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 13px;
}

.info-note {
  font-size: 12px;
  color: #888;
}

.info-value {
  color: #444;
}

.mail-section {
  background: var(--color-aqua-50);
  padding: 16px 20px;
  border-radius: 8px;
}

.mail-text {
  margin: 0 0 8px;
  font-size: 14px;
  color: #444;
}

.mail-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-aqua-700);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.mail-link:hover {
  color: var(--color-aqua-500);
  text-decoration: underline;
}

.modal-close {
  display: block;
  margin: 24px auto 0;
  padding: 10px 32px;
  border: 1px solid var(--color-aqua-400);
  border-radius: 8px;
  background: transparent;
  color: var(--color-aqua-700);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--color-aqua-50);
  border-color: var(--color-aqua-500);
}

.modal-pop-enter-active,
.modal-pop-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-pop-enter-from,
.modal-pop-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .links-section {
    padding: 48px 0;
  }

  .links-grid {
    gap: 32px;
    padding: 0 16px;
  }

  .card-row {
    gap: 8px;
  }

  .link-card {
    padding: 8px 14px;
    font-size: 13px;
  }

  .card-icon {
    font-size: 18px;
  }

  .exchange-modal {
    padding: 28px 24px;
  }

  .modal-title {
    font-size: 20px;
  }
}
</style>
