<script setup lang="ts">
/**
 * DynamicIslandPlayer - Inspired by dynamic-island-player
 * Source: https://github.com/ououduck/dynamic-island-player
 * Adapted as a Vue 3 component for the Lakeside theme.
 * Original: vanilla JS/CSS; This version: Vue 3 SFC with PrimeVue integration.
 */
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'

interface Track {
  name: string
  artist: string
  url: string
  cover: string
  lrc?: string
}

interface ApiTrack {
  id: number
  name: string
  artist: string
  url: string
  cover: string
  lrc: string
}

const playlist = ref<Track[]>([])
const currentIndex = ref(0)
const isPlaying = ref(false)
const isExpanded = ref(false)
const progress = ref(0)
const currentTime = ref('0:00')
const remainingTime = ref('0:00')
const audioRef = ref<HTMLAudioElement | null>(null)
const audio = ref<HTMLAudioElement | null>(null)
const isDragging = ref(false)
const searchQuery = ref('')
const showSearch = ref(false)

const currentTrack = computed(() => playlist.value[currentIndex.value] || null)

const filteredPlaylist = computed(() => {
  if (!searchQuery.value) return playlist.value
  const q = searchQuery.value.toLowerCase()
  return playlist.value.filter(
    (t) => t.name.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
  )
})

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

async function fetchPlaylist() {
  try {
    const res = await axios.get<ApiTrack[]>(
      'https://nativeapi.yuxiangwang0525.com/personalpage/getBackgroundMusic'
    )
    playlist.value = res.data.map((item) => ({
      name: item.name,
      artist: item.artist,
      url: item.url,
      cover: item.cover,
      lrc: item.lrc,
    }))
    if (playlist.value.length > 0) {
      const randomIndex = Math.floor(Math.random() * 10000) % playlist.value.length
      loadSong(randomIndex)
    }
  } catch (err) {
    console.error('Failed to fetch playlist:', err)
  }
}

function loadSong(index: number) {
  if (!audio.value || !playlist.value[index]) return
  currentIndex.value = index
  const track = playlist.value[index]
  audio.value.src = track.url
  audio.value.load()
}

function togglePlay() {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play().catch(() => {})
  }
}

function next() {
  if (playlist.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % playlist.value.length
  loadSong(currentIndex.value)
  if (isPlaying.value || true) {
    audio.value?.play().catch(() => {})
  }
}

function prev() {
  if (playlist.value.length === 0) return
  currentIndex.value =
    (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
  loadSong(currentIndex.value)
  if (isPlaying.value || true) {
    audio.value?.play().catch(() => {})
  }
}

function playTrack(index: number) {
  const realIndex = playlist.value.findIndex(
    (t) => t === filteredPlaylist.value[index]
  )
  if (realIndex >= 0) {
    loadSong(realIndex)
    audio.value?.play().catch(() => {})
    showSearch.value = false
    searchQuery.value = ''
  }
}

function onTimeUpdate() {
  if (!audio.value || isDragging.value) return
  const { duration, currentTime: ct } = audio.value
  if (duration > 0) {
    progress.value = (ct / duration) * 100
    currentTime.value = formatTime(ct)
    remainingTime.value = '-' + formatTime(duration - ct)
  }
}

function seekTo(e: MouseEvent | TouchEvent) {
  if (!audio.value || !audio.value.duration) return
  const bar = e.currentTarget as HTMLElement
  const rect = bar.getBoundingClientRect()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  audio.value.currentTime = percent * audio.value.duration
  progress.value = percent * 100
}

function onProgressClick(e: MouseEvent) {
  seekTo(e)
}

function onProgressMouseDown(e: MouseEvent) {
  isDragging.value = true
  seekTo(e)
  const onMove = (ev: MouseEvent) => {
    if (!audio.value || !audio.value.duration) return
    const bar = document.querySelector('.progress-container')
    if (!bar) return
    const rect = bar.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width))
    audio.value.currentTime = percent * audio.value.duration
    progress.value = percent * 100
  }
  const onUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function toggleCollapse() {
  isExpanded.value = !isExpanded.value
}

function toggleSearch() {
  showSearch.value = !showSearch.value
}

function onClickOutside(e: MouseEvent) {
  const el = document.querySelector('.dynamic-island')
  if (el && !el.contains(e.target as Node)) {
    isExpanded.value = false
    showSearch.value = false
  }
}

onMounted(() => {
  audio.value = new Audio()
  audio.value.addEventListener('timeupdate', onTimeUpdate)
  audio.value.addEventListener('ended', next)
  audio.value.addEventListener('play', () => { isPlaying.value = true })
  audio.value.addEventListener('pause', () => { isPlaying.value = false })
  document.addEventListener('click', onClickOutside)
  fetchPlaylist()
})

onBeforeUnmount(() => {
  audio.value?.removeEventListener('timeupdate', onTimeUpdate)
  audio.value?.removeEventListener('ended', next)
  document.removeEventListener('click', onClickOutside)
  audio.value?.pause()
  audio.value = null
})
</script>

<template>
  <div
    class="dynamic-island"
    :class="{ expanded: isExpanded, playing: isPlaying }"
    @click.stop="toggleCollapse"
  >
    <div class="search-box" v-if="showSearch" @click.stop>
      <input
        class="search-input"
        type="text"
        v-model="searchQuery"
        placeholder="Search..."
      />
      <div class="search-results" v-if="filteredPlaylist.length">
        <div
          v-for="(track, i) in filteredPlaylist"
          :key="i"
          class="search-result-item"
          @click="playTrack(i)"
        >
          <img :src="track.cover" :alt="track.name" class="result-cover" />
          <div class="result-info">
            <span class="result-name">{{ track.name }}</span>
            <span class="result-artist">{{ track.artist }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="island-head">
      <img
        v-if="currentTrack"
        :src="currentTrack.cover"
        :alt="currentTrack.name"
        class="cover-art"
      />
      <div class="cover-placeholder" v-else />
      <div class="player-info" v-if="currentTrack">
        <p class="song-title">{{ currentTrack.name }}</p>
        <p class="artist">{{ currentTrack.artist }}</p>
      </div>
      <div class="live-activity">
        <span class="wave-bar" :class="{ active: isPlaying }" />
        <span class="wave-bar" :class="{ active: isPlaying }" />
        <span class="wave-bar" :class="{ active: isPlaying }" />
        <span class="wave-bar" :class="{ active: isPlaying }" />
        <span class="wave-bar" :class="{ active: isPlaying }" />
      </div>
      <button class="search-btn" @click.stop="toggleSearch" aria-label="Search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </button>
    </div>

    <div class="progress-row" v-if="isExpanded" @click.stop>
      <span class="time-current">{{ currentTime }}</span>
      <div class="progress-container" @mousedown="onProgressMouseDown" @click="onProgressClick">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }" />
          <div class="progress-handle" :style="{ left: progress + '%' }" />
        </div>
      </div>
      <span class="time-remaining">{{ remainingTime }}</span>
    </div>

    <div class="controls" v-if="isExpanded" @click.stop>
      <button class="ctrl-btn" @click="prev" aria-label="Previous">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </svg>
      </button>
      <button class="ctrl-btn play-btn" @click="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
        <svg v-if="!isPlaying" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
        </svg>
      </button>
      <button class="ctrl-btn" @click="next" aria-label="Next">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.dynamic-island {
  --di-width: 340px;
  --di-height: 56px;
  --di-radius: 28px;
  --di-bg: rgba(255, 255, 255, 0.95);
  --di-text: #1a1a1a;
  --di-text-dim: #888;
  --di-accent: var(--color-aqua-500);
  --di-cover: 38px;
  --di-duration: 0.42s;
  --di-ease: cubic-bezier(0.32, 0.72, 0, 1);

  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: var(--di-width);
  height: var(--di-height);
  border-radius: var(--di-radius);
  background: var(--di-bg);
  backdrop-filter: blur(20px);
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.08),
    inset 0 0 0 0.5px rgba(0, 0, 0, 0.06);
  z-index: 999;
  cursor: pointer;
  overflow: hidden;
  transition:
    width var(--di-duration) var(--di-ease),
    height var(--di-duration) var(--di-ease),
    border-radius var(--di-duration) var(--di-ease),
    padding var(--di-duration) var(--di-ease);
  display: flex;
  flex-direction: column;
  padding: 8px 14px;
  gap: 6px;
}

.dynamic-island.expanded {
  --di-width: 380px;
  --di-height: 140px;
  --di-radius: 28px;
  padding: 12px 16px;
}

.island-head {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
}

.cover-art {
  width: var(--di-cover);
  height: var(--di-cover);
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.dynamic-island.playing .cover-art {
  animation: di-spin 8s linear infinite;
}

@keyframes di-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.cover-placeholder {
  width: var(--di-cover);
  height: var(--di-cover);
  border-radius: 8px;
  background: var(--color-aqua-100);
  flex-shrink: 0;
}

.player-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.song-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--di-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.artist {
  font-size: 11px;
  color: var(--di-text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.live-activity {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 16px;
  flex-shrink: 0;
}

.wave-bar {
  width: 3px;
  height: 4px;
  background: var(--di-accent);
  border-radius: 1.5px;
  transition: height 0.15s ease;
}

.wave-bar.active {
  animation: di-wave 0.8s ease-in-out infinite alternate;
}

.wave-bar:nth-child(1) { animation-delay: 0s; animation-duration: 0.6s; }
.wave-bar:nth-child(2) { animation-delay: 0.1s; animation-duration: 0.7s; }
.wave-bar:nth-child(3) { animation-delay: 0.2s; animation-duration: 0.5s; }
.wave-bar:nth-child(4) { animation-delay: 0.15s; animation-duration: 0.65s; }
.wave-bar:nth-child(5) { animation-delay: 0.05s; animation-duration: 0.75s; }

@keyframes di-wave {
  0% { height: 4px; }
  100% { height: 16px; }
}

.search-btn {
  background: none;
  border: none;
  color: var(--di-text-dim);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.search-btn:hover {
  color: var(--di-accent);
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-current,
.time-remaining {
  font-size: 10px;
  color: var(--di-text-dim);
  font-variant-numeric: tabular-nums;
  min-width: 32px;
}

.time-remaining {
  text-align: right;
}

.progress-container {
  flex: 1;
  height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.progress-bar {
  width: 100%;
  height: 3px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 1.5px;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: var(--di-accent);
  border-radius: 1.5px;
  transition: width 0.1s linear;
}

.progress-handle {
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--di-accent);
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.2s ease;
}

.progress-container:hover .progress-handle {
  transform: translate(-50%, -50%) scale(1);
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.ctrl-btn {
  background: none;
  border: none;
  color: var(--di-text);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.ctrl-btn:hover {
  color: var(--di-accent);
  background: var(--color-aqua-50);
}

.play-btn {
  width: 36px;
  height: 36px;
}

.search-box {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: var(--di-bg);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: di-rise 0.3s ease;
  cursor: default;
}

@keyframes di-rise {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  border: none;
  outline: none;
  font-size: 13px;
  background: transparent;
  color: var(--di-text);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.search-input::placeholder {
  color: var(--di-text-dim);
}

.search-results {
  max-height: 200px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.search-result-item:hover {
  background: var(--color-aqua-50);
}

.result-cover {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
}

.result-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.result-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--di-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-artist {
  font-size: 10px;
  color: var(--di-text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .dynamic-island {
    --di-width: 280px;
    --di-height: 48px;
    --di-cover: 32px;
    top: 10px;
  }

  .dynamic-island.expanded {
    --di-width: calc(100vw - 32px);
    --di-height: 130px;
  }

  .song-title {
    font-size: 12px;
  }

  .artist {
    font-size: 10px;
  }

  .controls {
    gap: 20px;
  }
}

@media (max-width: 380px) {
  .dynamic-island {
    --di-width: 240px;
    --di-height: 44px;
    --di-cover: 28px;
  }
}

@media (hover: none) {
  .ctrl-btn {
    padding: 8px;
  }

  .progress-handle {
    transform: translate(-50%, -50%) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dynamic-island,
  .wave-bar,
  .cover-art,
  .ctrl-btn,
  .search-box {
    transition-duration: 0.01s !important;
    animation-duration: none !important;
  }
}
</style>
