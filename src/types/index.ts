export interface Tool {
  id: string
  name: string
  description: string
  image_url?: string
  category: string
  website_url: string
  github_url?: string
  logo_url?: string
  tags: string[]
  rating: number
  review_count: number
  user_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Repository {
  id: string
  name: string
  description: string
  image_url?: string
  category: string
  github_url: string
  language: string
  stars: number
  forks: number
  tags: string[]
  rating: number
  review_count: number
  user_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Model {
  id: string
  name: string
  description: string
  image_url?: string
  category: string
  model_type: string
  parameters?: string
  license?: string
  huggingface_url?: string
  paper_url?: string
  demo_url?: string
  tags: string[]
  rating: number
  review_count: number
  download_count: number
  user_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  bio?: string
  website?: string
  github_username?: string
  role: 'user' | 'admin'
  created_at: string
}

export interface Review {
  id: string
  tool_id?: string
  repository_id?: string
  model_id?: string
  user_id: string
  rating: number
  comment: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  count: number
}

export type ContentType = 'tools' | 'repositories' | 'models'

export interface SearchResult {
  tools: Tool[]
  repositories: Repository[]
  models: Model[]
  total: number
}