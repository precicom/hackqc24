export interface UserVote {
  id: number
  is_downvote: boolean
  created_at: string
  user_id: number
  post_id: number
}