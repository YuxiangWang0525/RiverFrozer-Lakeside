<script setup lang="ts">
import { useData } from 'vitepress'
import HomePage from './pages/HomePage.vue'
import BlogPage from './pages/BlogPage.vue'
import BlogPostPage from './pages/BlogPostPage.vue'
import DeparturePage from './pages/DeparturePage.vue'
import { useLang } from './composables/useLang'

const { frontmatter, page } = useData()
const { toggleLocale, t, isZh } = useLang()
</script>

<template>
  <div class="site-root">
    <button class="lang-toggle" @click="toggleLocale">
      {{ t('lang') }}
    </button>

    <HomePage v-if="frontmatter.home" />
    <DeparturePage v-else-if="frontmatter.departure" />
    <BlogPostPage v-else-if="frontmatter.blogpost" />
    <BlogPage v-else-if="frontmatter.blog" />
    <div v-else class="default-page">
      <Content />
    </div>

    <DynamicIslandPlayer v-if="frontmatter.home" />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from 'vue'

const DynamicIslandPlayer = defineAsyncComponent(
  () => import('./components/DynamicIslandPlayer.vue')
)
</script>

<style scoped>
.site-root {
  position: relative;
}

.lang-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  padding: 6px 16px;
  border: 1px solid var(--color-aqua-300);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-aqua-700);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

.lang-toggle:hover {
  background: var(--color-aqua-50);
  border-color: var(--color-aqua-500);
}

.default-page {
  max-width: 720px;
  margin: 80px auto;
  padding: 0 24px;
}
</style>
