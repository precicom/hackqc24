import { UserVote } from '../user-votes/classes'

export interface Comment {
  id: number
  user_id: number
  post_id: number
  content_text: string
  image: string
  rejection_reason: string
  created_at: string
  user_votes: UserVote[]
  status: CommentStatuses
}

export type CommentStatuses = 'in_process' | 'accepted' | 'rejected'

export interface File {}
