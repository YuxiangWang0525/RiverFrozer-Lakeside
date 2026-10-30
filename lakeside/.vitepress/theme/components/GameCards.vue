<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import games from '../data/games.json'

const { t, locale } = useI18n()
const isZh = computed(() => locale.value === 'zh-CN')

const gameTitle = computed(() => {
  const underline = '<span class="underline">' + (isZh.value ? '世界' : 'Worlds') + '</span>'
  return (isZh.value ? '我踏足的' : 'My ') + underline
})

function getGameName(game: (typeof games)[0]) {
  return isZh.value ? game.name : game.nameEn
}

function getTileStyle(game: (typeof games)[0]) {
  const styles: Record<string, string> = { backgroundColor: game.color || '#1A1A1A' }
  if (game.image) {
    styles.backgroundImage = `url(${game.image})`
    styles.backgroundSize = 'cover'
    styles.backgroundPosition = 'center'
  }
  return styles
}

const showGameModal = ref(false)
const selectedGame = ref<(typeof games)[0] | null>(null)
const copiedId = ref('')

function handleGameClick(game: (typeof games)[0]) {
  if (game.link) {
    window.open(game.link, '_blank')
    return
  }
  if (game.game_ids && game.game_ids.length > 0) {
    selectedGame.value = game
    showGameModal.value = true
    copiedId.value = ''
  }
}

function copyId(value: string) {
  navigator.clipboard.writeText(value).then(() => {
    copiedId.value = value
    setTimeout(() => { copiedId.value = '' }, 2000)
  })
}

function closeGameModal() {
  showGameModal.value = false
  selectedGame.value = null
}
</script>

<template>
  <section class="game-section">
    <div class="game-header">
      <h2 class="game-title" v-html="gameTitle"></h2>
    </div>
    <div class="game-grid">
      <div
        v-for="game in games"
        :key="getGameName(game)"
        class="game-tile"
        :style="getTileStyle(game)"
        @click="handleGameClick(game)"
      >
        <div class="tile-overlay" />
        <div class="tile-info">
          <span class="tile-name">{{ getGameName(game) }}</span>
        </div>
      </div>
    </div>

    <Transition name="modal-pop">
      <div class="modal-overlay" v-if="showGameModal" @click="closeGameModal">
        <div class="game-modal" @click.stop>
          <h3 class="modal-title">{{ selectedGame ? getGameName(selectedGame) : '' }}</h3>
          <div class="id-list">
            <div v-for="id in selectedGame?.game_ids" :key="id.value" class="id-item">
              <span class="id-label">{{ isZh ? id.label : id.labelEn }}</span>
              <div class="id-value-row">
                <code class="id-value">{{ id.value }}</code>
                <button class="copy-btn" @click="copyId(id.value)">
                  {{ copiedId === id.value ? t('gameIds.copied') : t('gameIds.copy') }}
                </button>
              </div>
            </div>
          </div>
          <button class="modal-close" @click="closeGameModal">{{ t('gameIds.close') }}</button>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.game-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  background: var(--color-bg);
}

.game-header {
  width: 100%;
  max-width: 1200px;
  padding: 0 40px 32px;
}

.game-title {
  font-size: 28px;
  font-weight: 400;
  color: var(--color-text-primary);
  text-align: left;
  margin: 0;
}

.game-title :deep(.underline) {
  text-decoration: underline;
  text-decoration-color: var(--color-aqua-400);
  text-decoration-thickness: 3px;
  text-underline-offset: 4px;
}

.game-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
  padding: 0 40px;
  max-width: 1200px;
}

.game-tile {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.game-tile:hover {
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal-pop-enter-active,
.modal-pop-leave-active {
  transition: opacity 0.25s ease;
}

.modal-pop-enter-active .game-modal,
.modal-pop-leave-active .game-modal {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}

.modal-pop-enter-from,
.modal-pop-leave-to {
  opacity: 0;
}

.modal-pop-enter-from .game-modal {
  transform: scale(0.85) translateY(16px);
  opacity: 0;
}

.modal-pop-leave-to .game-modal {
  transform: scale(0.9) translateY(8px);
  opacity: 0;
}

.game-modal {
  background: var(--color-bg);
  border-radius: 12px;
  padding: 32px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 20px;
}

.id-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.id-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  display: block;
  margin-bottom: 4px;
}

.id-value-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.id-value {
  font-family: var(--font-mono);
  font-size: 14px;
  background: var(--color-bg-alt);
  padding: 6px 12px;
  border-radius: 4px;
  color: var(--color-text-primary);
  flex: 1;
}

.copy-btn {
  padding: 6px 14px;
  border: 1px solid var(--color-aqua-300);
  border-radius: 4px;
  background: var(--color-aqua-50);
  color: var(--color-aqua-700);
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: var(--color-aqua-100);
}

.modal-close {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  color: var(--color-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  border-color: var(--color-aqua-400);
  color: var(--color-aqua-700);
}

@media (max-width: 768px) {
  .game-section {
    min-height: auto;
    padding: 40px 0;
  }

  .game-header {
    padding: 0 16px 24px;
  }

  .game-title {
    font-size: 22px;
  }

  .game-title :deep(.underline) {
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
  }

  .game-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 10px;
    padding: 0 16px;
  }

  .game-tile {
    aspect-ratio: 16 / 9;
  }

  .tile-name {
    font-size: 14px;
  }

  .game-modal {
    padding: 24px;
    min-width: 280px;
  }
}
</style>
