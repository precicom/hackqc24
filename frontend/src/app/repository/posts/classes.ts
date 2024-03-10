export interface Post {
  id: number
  user_id: number
  content_text: string
  theme_id: number
  status: PostStatuses
  rejection_reason: string
  created_at: string
}

export type PostStatuses = 'en_attente_triage' | 'trié' | 'rejeté'