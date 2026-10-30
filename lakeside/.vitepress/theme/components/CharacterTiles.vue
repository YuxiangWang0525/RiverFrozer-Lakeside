<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import characters from '../data/characters.json'

const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh-CN')

const gridRef = ref<HTMLElement | null>(null)
const currentPage = ref(0)
const tilesPerPage = ref(12)
const isFlipping = ref(false)
const isMobile = ref(false)
let flipTimer: ReturnType<typeof setInterval> | null = null

const totalPages = computed(() => Math.ceil(characters.length / tilesPerPage.value))

const currentCharacters = computed(() => {
  const start = currentPage.value * tilesPerPage.value
  return characters.slice(start, start + tilesPerPage.value)
})

function calcTilesPerPage() {
  if (!gridRef.value) return
  const w = window.innerWidth
  const h = window.innerHeight
  isMobile.value = w <= 768

  const tileW = isMobile.value ? 200 : 280
  const tileH = isMobile.value ? 112.5 : 157.5
  const gap = isMobile.value ? 10 : 14
  const padding = isMobile.value ? 32 : 80

  const cols = Math.floor((w - padding * 2 + gap) / (tileW + gap))
  const rows = Math.floor((h - 200 + gap) / (tileH + gap))
  tilesPerPage.value = Math.max(cols * rows, 4)
}

function nextPage() {
  if (totalPages.value <= 1) return
  isFlipping.value = true
  setTimeout(() => {
    currentPage.value = (currentPage.value + 1) % totalPages.value
    isFlipping.value = false
  }, 400)
}

function startAutoFlip() {
  stopAutoFlip()
  const interval = isMobile.value ? 5000 : 10000
  flipTimer = setInterval(nextPage, interval)
}

function stopAutoFlip() {
  if (flipTimer) {
    clearInterval(flipTimer)
    flipTimer = null
  }
}

function getTileStyle(char: (typeof characters)[0]) {
  const bgColor = char.color || '#1A1A1A'
  return { backgroundColor: bgColor }
}

function getTileBgImage(char: (typeof characters)[0]) {
  if (char.image) {
    return { backgroundImage: `url(${char.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  }
  return {}
}

function getCharName(char: (typeof characters)[0]) {
  return isZh.value ? char.name : char.nameEn
}

onMounted(() => {
  calcTilesPerPage()
  startAutoFlip()
  window.addEventListener('resize', calcTilesPerPage)
})

onBeforeUnmount(() => {
  stopAutoFlip()
  window.removeEventListener('resize', calcTilesPerPage)
})
</script>

<template>
  <section class="character-section">
    <div class="character-header">
      <h2 class="character-title">
        我所喜爱的<span class="underline">角色们</span>：
      </h2>
    </div>
    <div class="character-grid" ref="gridRef">
      <TransitionGroup name="tile-flip" tag="div" class="tile-container">
        <div
          v-for="char in currentCharacters"
          :key="`${currentPage}-${getCharName(char)}`"
          class="char-tile"
          :style="[getTileStyle(char), getTileBgImage(char)]"
        >
          <div class="tile-overlay" />
          <div class="tile-info">
            <span class="tile-name">{{ getCharName(char) }}</span>
            <span class="tile-work">{{ char.work }}</span>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <div class="page-dots" v-if="totalPages > 1">
      <span
        v-for="p in totalPages"
        :key="p"
        class="dot"
        :class="{ active: p - 1 === currentPage }"
      />
    </div>
  </section>
</template>

<style scoped>
.character-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  background: var(--color-bg);
}

.character-header {
  width: 100%;
  max-width: 1200px;
  padding: 0 40px 32px;
}

.character-title {
  font-size: 28px;
  font-weight: 400;
  color: var(--color-text-primary);
  text-align: left;
  margin: 0;
}

.underline {
  text-decoration: underline;
  text-decoration-color: var(--color-aqua-400);
  text-decoration-thickness: 3px;
  text-underline-offset: 4px;
}

.character-grid {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tile-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
  padding: 0 40px;
  width: 100%;
  max-width: 1200px;
}

.char-tile {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
  overflow: hidden;
  cursor: default;
  transition: transform 0.2s ease;
}

.char-tile:hover {
  transform: scale(1.03);
}

.tile-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0) 60%
  );
}

.tile-info {
  position: absolute;
  bottom: 12px;
  left: 14px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.tile-name {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.tile-work {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.page-dots {
  display: flex;
  gap: 8px;
  margin-top: 24px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border);
  transition: background 0.3s ease;
}

.dot.active {
  background: var(--color-aqua-500);
}

.tile-flip-enter-active,
.tile-flip-leave-active {
  transition: all 0.4s ease;
}

.tile-flip-enter-from {
  opacity: 0;
  transform: rotateY(90deg);
}

.tile-flip-leave-to {
  opacity: 0;
  transform: rotateY(-90deg);
}

.tile-flip-enter-to,
.tile-flip-leave-from {
  opacity: 1;
  transform: rotateY(0deg);
}

@media (max-width: 768px) {
  .character-header {
    padding: 0 16px 24px;
  }

  .character-title {
    font-size: 22px;
  }

  .underline {
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
  }

  .tile-container {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 10px;
    padding: 0 16px;
  }

  .char-tile {
    aspect-ratio: 16 / 9;
  }

  .tile-name {
    font-size: 14px;
  }

  .tile-work {
    font-size: 11px;
  }

  .character-section {
    min-height: auto;
    padding: 40px 0;
  }
}
</style>
