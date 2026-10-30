<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { t } = useI18n()

const targetUrl = ref('')
const targetName = ref('')
const countdown = ref(5)
let timer: ReturnType<typeof setInterval> | null = null

const siteName = computed(() => t('departure.siteName'))

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  targetUrl.value = params.get('url') || ''
  targetName.value = params.get('name') || targetUrl.value

  if (!targetUrl.value) {
    window.location.replace('/')
    return
  }

  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (timer) clearInterval(timer)
      window.location.replace(targetUrl.value)
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function goBack() {
  window.history.length > 1 ? window.history.back() : window.location.replace('/')
}
</script>

<template>
  <div class="departure-page">
    <div class="departure-content">
      <h1 class="departure-title">{{ t('departure.leaving') }} {{ siteName }} !</h1>
      <p class="departure-redirect">
        {{ t('departure.redirecting') }} <strong>{{ targetName }}</strong>
      </p>
      <p class="departure-url">{{ targetUrl }}</p>
      <p class="departure-countdown">{{ t('departure.remaining', { seconds: countdown }) }}</p>
      <button class="departure-back" @click="goBack">
        <Icon icon="mdi:arrow-left" width="18" />
        {{ t('departure.goBack') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.departure-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #9FD0DE 100%);
  padding: 24px 80px;
}

.departure-content {
  text-align: left;
  max-width: 600px;
}

.departure-title {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px;
}

.departure-redirect {
  font-size: 16px;
  color: #444;
  margin: 0 0 12px;
  line-height: 1.6;
}

.departure-url {
  font-size: 14px;
  color: var(--color-aqua-700, #2D7A8F);
  word-break: break-all;
  margin: 0 0 24px;
  font-family: monospace;
}

.departure-countdown {
  font-size: 15px;
  color: #666;
  margin: 0 0 32px;
}

.departure-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border: 1px solid var(--color-aqua-400, #7BC0D4);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  color: var(--color-aqua-700, #2D7A8F);
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

.departure-back:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: var(--color-aqua-500, #5BA8C0);
}

@media (max-width: 768px) {
  .departure-page {
    padding: 24px 32px;
  }
  .departure-title {
    font-size: 26px;
  }
}
</style>
