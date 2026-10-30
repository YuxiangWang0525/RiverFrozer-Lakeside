import axios from 'axios'

const API_BASE = 'https://blog.yuxiangwang0525.com'
const API_TOKEN = '637f7e30c797'

const api = axios.create({
  baseURL: API_BASE,
  params: {
    token: API_TOKEN,
  },
})

export interface Category {
  mid: number
  name: string
  slug: string
  description: string
  count: number
  permalink: string
  url: string
}

export interface Post {
  cid: number
  title: string
  slug: string
  created: number
  modified: number
  digest: string
  commentsNum: number
  type: string
  categories: Category[]
  category: string
  date: {
    timeStamp: number
    year: string
    month: string
    day: string
  }
  permalink?: string
  url?: string
}

export interface PostsResponse {
  status: string
  message: string
  data: {
    page: number
    pageSize: number
    pages: number
    count: number
    dataSet: Post[]
  }
}

export interface CategoriesResponse {
  status: string
  message: string
  data: Category[]
}

export async function getPosts(page = 1, pageSize = 10): Promise<PostsResponse> {
  const res = await api.get('/api/posts', {
    params: { page, pageSize },
  })
  return res.data
}

export async function getPost(cid: number) {
  const res = await api.get('/api/post', {
    params: { cid },
  })
  return res.data
}

export async function getPostBySlug(slug: string) {
  const res = await api.get('/api/post', {
    params: { slug },
  })
  return res.data
}

export async function getCategories(): Promise<CategoriesResponse> {
  const res = await api.get('/api/categories')
  return res.data
}
