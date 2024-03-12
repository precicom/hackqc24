import { UserVote } from "../user-votes/classes"

export interface Comment {
  id: number
  user_id: number
  post_id: number
  content_text: string
  image: File
  rejection_reason: string
  created_at: string
  user_votes: UserVote[]
}

export interface File {

}