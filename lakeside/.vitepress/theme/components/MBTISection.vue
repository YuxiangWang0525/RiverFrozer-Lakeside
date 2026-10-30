<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLineAnimation } from '../composables/useLineAnimation'

const { t } = useI18n()
const containerRef = ref<HTMLElement | null>(null)
useLineAnimation(containerRef, { stagger: 200 })
</script>

<template>
  <section class="mbti-section" ref="containerRef">
    <div class="mbti-image line-animate-item">
      <img src="../assets/mbti-enfj.png" alt="MBTI ENFJ" />
    </div>
    <div class="mbti-text line-animate-item">
      <h2 class="mbti-title">{{ t('mbti.title') }}</h2>
      <p class="mbti-subtitle">{{ t('mbti.subtitle') }}</p>
    </div>
  </section>
</template>

<style scoped>
.mbti-section {
  background: var(--color-chocolate);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 64px;
  padding: 80px 48px;
}

.mbti-image {
  flex-shrink: 0;
}

.mbti-image img {
  width: 280px;
  height: auto;
  border-radius: 8px;
}

.mbti-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mbti-title {
  font-size: 36px;
  font-weight: 300;
  color: #FFFFFF;
  letter-spacing: 2px;
}

.mbti-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 300;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .mbti-section {
    flex-direction: column;
    gap: 32px;
    padding: 60px 24px;
    min-height: auto;
  }

  .mbti-image img {
    width: 200px;
  }

  .mbti-text {
    text-align: center;
    align-items: center;
  }

  .mbti-title {
    font-size: 28px;
  }

  .mbti-subtitle {
    font-size: 15px;
  }
}
</style>
