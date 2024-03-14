import { Comment } from "../comments/classes"
import { Theme } from "../themes/classes"
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
  comments?: Comment[]
  user?: User
  image?: string
  theme?: Theme
}

export type PostStatuses = 'in_process' | 'accepted' | 'rejected'