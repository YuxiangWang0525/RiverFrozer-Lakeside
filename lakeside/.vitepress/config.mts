import { defineConfig } from 'vitepress'

const definePlugin = {
  name: 'define-vue-prod-devtools',
  config() {
    return {
      define: {
        __VUE_PROD_DEVTOOLS__: 'false',
      },
    }
  },
}

export default defineConfig({
  srcDir: "..\\article",
  outDir: "..\\lakeside\\.vitepress\\dist",
  cacheDir: "..\\lakeside\\.vitepress\\cache",

  title: "晚江右海的个人网站",
  description: "晚江右海的个人网站",

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/avatar.svg' }],
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '博客', link: '/blog/' },
        ],
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Blog', link: '/en/blog/' },
        ],
      },
    },
  },

  vite: {
    plugins: [definePlugin],
    resolve: {
      alias: {
        '@i18n': '/.vitepress/theme/i18n',
      },
    },
    ssr: {
      noExternal: ['vue-i18n'],
    },
  },

  ignoreDeadLinks: true,
})
