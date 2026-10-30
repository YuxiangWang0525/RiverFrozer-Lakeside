<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPost } from '../api/blog'
import SiteFooter from '../components/SiteFooter.vue'

const { locale } = useI18n()
const isZh = computed(() => locale.value === 'zh-CN')

const title = ref('')
const content = ref('')
const date = ref('')
const category = ref('')
const commentsNum = ref(0)
const loading = ref(true)
const error = ref('')

function getCidFromUrl(): number | null {
  const params = new URLSearchParams(window.location.search)
  const cid = params.get('cid')
  return cid ? Number(cid) : null
}

async function loadPost(cid: number) {
  loading.value = true
  error.value = ''
  try {
    const res = await getPost(cid)
    if (res.status === 'success') {
      const d = res.data
      title.value = d.title
      content.value = d.text || d.digest || ''
      commentsNum.value = d.commentsNum || 0
      category.value = d.category || ''
      const dateObj = new Date(d.created * 1000)
      date.value = dateObj.toLocaleDateString(isZh.value ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } else {
      error.value = isZh.value ? '文章加载失败' : 'Failed to load post'
    }
  } catch {
    error.value = isZh.value ? '文章加载失败' : 'Failed to load post'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const cid = getCidFromUrl()
  if (cid) {
    loadPost(cid)
  } else {
    loading.value = false
    error.value = isZh.value ? '未指定文章' : 'No post specified'
  }
})

watch(() => getCidFromUrl(), (newCid) => {
  if (newCid) loadPost(newCid)
})
</script>

<template>
  <div class="post-page-wrapper">
    <article class="post-page">
      <div v-if="loading" class="loading">
        {{ isZh ? '加载中...' : 'Loading...' }}
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <template v-else>
        <header class="post-header">
          <span class="post-category" v-if="category">{{ category }}</span>
          <h1 class="post-title">{{ title }}</h1>
          <div class="post-meta">
            <time class="post-date">{{ date }}</time>
            <span class="post-comments">
              {{ commentsNum }} {{ isZh ? '评论' : 'comments' }}
            </span>
          </div>
        </header>

        <div class="post-content" v-html="content" />

        <div class="post-back">
          <a href="/blog/" class="back-link">
            {{ isZh ? '← 返回博客' : '← Back to Blog' }}
          </a>
        </div>
      </template>
    </article>

    <SiteFooter />
  </div>
</template>

<style scoped>
.post-page-wrapper {
  display: flex;
  flex-direction: column;
}

.post-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 80px 24px 64px;
  flex: 1;
}

.loading,
.error {
  text-align: center;
  padding: 80px 0;
  color: var(--color-text-secondary);
  font-size: 16px;
}

.error {
  color: #c62828;
}

.post-header {
  margin-bottom: 40px;
}

.post-category {
  display: inline-block;
  font-size: 12px;
  padding: 3px 10px;
  background: var(--color-aqua-50);
  color: var(--color-aqua-700);
  border-radius: 4px;
  border: 1px solid var(--color-aqua-100);
  margin-bottom: 12px;
}

.post-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
  margin-bottom: 14px;
}

.post-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.post-content {
  font-size: 15px;
  line-height: 2;
  color: var(--color-text-primary);
}

.post-content :deep(p) {
  margin-bottom: 16px;
}

.post-content :deep(h2) {
  font-size: 22px;
  font-weight: 600;
  margin: 32px 0 12px;
  color: var(--color-aqua-700);
}

.post-content :deep(h3) {
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 10px;
  color: var(--color-aqua-700);
}

.post-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 16px 0;
}

.post-content :deep(a) {
  color: var(--color-aqua-600);
  text-decoration: underline;
}

.post-content :deep(blockquote) {
  border-left: 3px solid var(--color-aqua-300);
  padding-left: 16px;
  margin: 16px 0;
  color: var(--color-text-secondary);
}

.post-content :deep(code) {
  background: var(--color-bg-alt);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.post-content :deep(pre) {
  background: var(--color-bg-alt);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
}

.post-content :deep(pre code) {
  background: none;
  padding: 0;
}

.post-back {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.back-link {
  font-size: 14px;
  color: var(--color-aqua-600);
  text-decoration: none;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-aqua-500);
}

@media (max-width: 768px) {
  .post-page {
    padding: 60px 16px 48px;
  }

  .post-title {
    font-size: 24px;
  }
}
</style>
