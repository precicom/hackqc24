export interface Comment {
  id: number
  user_id: number
  post_id: number
  content_text: string
  image: File
  rejection_reason: string
  created_at: string
}

export interface File {

}