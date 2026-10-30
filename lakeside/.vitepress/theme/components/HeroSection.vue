<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLineAnimation } from '../composables/useLineAnimation'

const { t, locale } = useI18n()
const containerRef = ref<HTMLElement | null>(null)
useLineAnimation(containerRef, { stagger: 150 })

const hostname = ref('')
const isMeDomain = computed(() => hostname.value === 'riverfrozer.me')
const isComDomain = computed(() => hostname.value === 'yuxiangwang0525.com' || hostname.value === 'localhost' || hostname.value === '')

const backgroundImage = ref('https://nativeapi.yuxiangwang0525.com/personalpage/getBackgroundImage')

onMounted(() => {
  hostname.value = window.location.hostname
})
</script>

<template>
  <section class="hero" ref="containerRef">
    <div class="hero-background">
      <img :src="backgroundImage" alt="" class="hero-bg-image" />
      <div class="hero-overlay" />
    </div>

    <div class="hero-content">
      <h1 class="hero-title line-animate-item">{{ t('hero.nickname') }}</h1>

      <div class="hero-domains">
        <div class="domain-block line-animate-item" v-if="isComDomain">
          <span class="domain-label">yuxiangwang0525.com</span>
          <p class="domain-text">{{ t('hero.welcomeCom') }}</p>
          <p class="domain-text">{{ t('hero.occupation') }}</p>
          <p class="domain-text">{{ t('hero.intro') }}</p>
          <p class="domain-text">{{ t('hero.hobby') }}</p>
          <p class="domain-text">{{ t('hero.games') }}</p>
        </div>

        <div class="domain-block line-animate-item" v-if="isMeDomain">
          <span class="domain-label">riverfrozer.me</span>
          <p class="domain-text">{{ t('hero.welcomeMe') }}</p>
          <p class="domain-text">{{ t('hero.meIntroduce') }}</p>
          <p class="domain-text">{{ t('hero.swipedown') }}</p>
        </div>

        <div class="domain-block line-animate-item" v-if="!isComDomain && !isMeDomain">
          <span class="domain-label">localhost</span>
          <p class="domain-text">{{ t('hero.welcomeCom') }}</p>
          <p class="domain-text">{{ t('hero.occupation') }}</p>
          <p class="domain-text">{{ t('hero.intro') }}</p>
          <p class="domain-text">{{ t('hero.hobby') }}</p>
          <p class="domain-text">{{ t('hero.games') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(4px);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(4px);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 80px 24px;
}

.hero-title {
  font-size: 56px;
  font-weight: 300;
  color: var(--color-aqua-700);
  margin-bottom: 48px;
  letter-spacing: 4px;
}

.hero-domains {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.domain-block {
  border-left: 2px solid var(--color-aqua-300);
  padding-left: 24px;
  background: rgba(255, 255, 255, 0.4);
  padding: 20px 24px;
  border-radius: 8px;
  backdrop-filter: blur(8px);
}

.domain-label {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-aqua-600);
  background: var(--color-aqua-50);
  padding: 2px 10px;
  border-radius: 3px;
  margin-bottom: 12px;
}

.domain-text {
  font-size: 18px;
  line-height: 2;
  color: var(--color-text-primary);
  font-weight: 300;
}

@media (max-width: 768px) {
  .hero-content {
    padding: 60px 16px;
  }

  .hero-title {
    font-size: 36px;
    margin-bottom: 32px;
  }

  .domain-text {
    font-size: 15px;
  }

  .domain-block {
    padding: 16px;
  }
}
</style>
