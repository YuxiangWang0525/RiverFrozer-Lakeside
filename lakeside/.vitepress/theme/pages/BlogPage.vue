<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPosts, getCategories, type Post, type Category } from '../api/blog'
import SiteFooter from '../components/SiteFooter.vue'

const { t, locale } = useI18n()
const isZh = computed(() => locale.value === 'zh-CN')

const posts = ref<Post[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10

async function loadPosts(page = 1) {
  loading.value = true
  try {
    const res = await getPosts(page, pageSize)
    if (res.status === 'success') {
      posts.value = res.data.dataSet
      currentPage.value = res.data.page
      totalPages.value = res.data.pages
    }
  } catch (err) {
    console.error('Failed to load posts:', err)
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  try {
    const res = await getCategories()
    if (res.status === 'success') {
      categories.value = res.data
    }
  } catch {
    categories.value = []
  }
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString(isZh.value ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getPostUrl(post: Post): string {
  return `/blog/post/?cid=${post.cid}`
}

function goToPost(post: Post) {
  window.location.href = getPostUrl(post)
}

function stripHtml(html: string): string {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

onMounted(() => {
  loadPosts()
  loadCategories()
})
</script>

<template>
  <div class="blog-wrapper">
    <div class="blog-page">
      <div class="blog-header">
        <h1 class="blog-title">{{ isZh ? '博客' : 'Blog' }}</h1>
        <p class="blog-subtitle">{{ isZh ? '从 Typecho 加载的文章' : 'Articles from Typecho' }}</p>
      </div>

      <div class="blog-layout">
        <main class="blog-main">
          <div v-if="loading" class="loading">
            {{ isZh ? '加载中...' : 'Loading...' }}
          </div>

          <div v-else-if="posts.length === 0" class="empty">
            {{ isZh ? '暂无文章' : 'No posts yet' }}
          </div>

          <div v-else class="post-list">
            <article
              v-for="post in posts"
              :key="post.cid"
              class="post-card"
              @click="goToPost(post)"
            >
              <h2 class="post-title">{{ post.title }}</h2>
              <div class="post-meta">
                <time class="post-date">{{ formatDate(post.created) }}</time>
                <span class="post-comments">
                  {{ post.commentsNum }} {{ isZh ? '评论' : 'comments' }}
                </span>
              </div>
              <div class="post-categories" v-if="post.categories && post.categories.length">
                <span
                  v-for="cat in post.categories"
                  :key="cat.mid"
                  class="category-tag"
                >
                  {{ cat.name }}
                </span>
              </div>
              <div class="post-excerpt">{{ stripHtml(post.digest).substring(0, 180) }}...</div>
              <span class="read-more">{{ isZh ? '阅读全文 →' : 'Read more →' }}</span>
            </article>
          </div>

          <div class="pagination" v-if="totalPages > 1">
            <button
              class="page-btn"
              :disabled="currentPage <= 1"
              @click="loadPosts(currentPage - 1)"
            >
              {{ isZh ? '上一页' : '← Previous' }}
            </button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button
              class="page-btn"
              :disabled="currentPage >= totalPages"
              @click="loadPosts(currentPage + 1)"
            >
              {{ isZh ? '下一页' : 'Next →' }}
            </button>
          </div>
        </main>

        <aside class="blog-sidebar">
          <div class="sidebar-section" v-if="categories.length">
            <h3 class="sidebar-title">{{ isZh ? '分类' : 'Categories' }}</h3>
            <ul class="sidebar-list">
              <li v-for="cat in categories" :key="cat.mid" class="sidebar-item">
                {{ cat.name }}
                <span class="item-count">{{ cat.count }}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>

    <SiteFooter />
  </div>
</template>

<style scoped>
.blog-wrapper {
  display: flex;
  flex-direction: column;
}

.blog-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px 0;
  flex: 1;
}

.blog-header {
  margin-bottom: 48px;
  text-align: center;
}

.blog-title {
  font-size: 42px;
  font-weight: 300;
  color: var(--color-aqua-700);
  letter-spacing: 2px;
  margin-bottom: 12px;
}

.blog-subtitle {
  font-size: 16px;
  color: var(--color-text-secondary);
}

.blog-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 48px;
  margin-bottom: 64px;
}

.blog-main {
  min-width: 0;
}

.loading,
.empty {
  text-align: center;
  padding: 64px 0;
  color: var(--color-text-secondary);
  font-size: 16px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 24px 28px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.post-card:hover {
  border-color: var(--color-aqua-400);
  box-shadow: 0 4px 16px rgba(0, 188, 212, 0.08);
  transform: translateY(-1px);
}

.post-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 10px;
  line-height: 1.4;
}

.post-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 14px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.post-categories {
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.category-tag {
  font-size: 12px;
  padding: 3px 10px;
  background: var(--color-aqua-50);
  color: var(--color-aqua-700);
  border-radius: 4px;
  border: 1px solid var(--color-aqua-100);
}

.post-excerpt {
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-text-secondary);
  margin-bottom: 14px;
}

.read-more {
  font-size: 13px;
  color: var(--color-aqua-600);
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
}

.page-btn {
  padding: 8px 20px;
  border: 1px solid var(--color-aqua-300);
  border-radius: 6px;
  background: var(--color-bg);
  color: var(--color-aqua-700);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-sans);
}

.page-btn:hover:not(:disabled) {
  background: var(--color-aqua-50);
  border-color: var(--color-aqua-500);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
}

.blog-sidebar {
  position: sticky;
  top: 24px;
  height: fit-content;
}

.sidebar-section {
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-aqua-700);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 14px;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border);
}

.sidebar-item:last-child {
  border-bottom: none;
}

.item-count {
  font-size: 12px;
  color: var(--color-aqua-600);
  background: var(--color-aqua-50);
  padding: 2px 8px;
  border-radius: 10px;
}

@media (max-width: 968px) {
  .blog-layout {
    grid-template-columns: 1fr;
  }

  .blog-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .blog-page {
    padding: 60px 16px 0;
  }

  .blog-title {
    font-size: 32px;
  }

  .post-title {
    font-size: 18px;
  }

  .post-card {
    padding: 18px 20px;
  }
}
</style>
