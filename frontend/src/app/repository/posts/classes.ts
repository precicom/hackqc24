import { UserVote } from "../user-votes/classes"
import { User } from "../users/classes"

export interface Post {
  id: number
  user_id: number
 
  content_text: string
  theme_id: number
  status: PostStatuses
  rejection_reason: string
  created_at: string
  user_votes?: Partial<UserVote>[]
  comments?: Partial<Comment>[]
  user?: User
}

export type PostStatuses = 'en_attente_triage' | 'trié' | 'rejeté'