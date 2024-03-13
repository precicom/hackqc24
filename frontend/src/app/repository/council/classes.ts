import { DiscussionPoint } from "../discussion-points/classes"

export interface Council {
  id: number,
  title: string,
  date: string,
  youtube_link: string,
  generated_summary: string
  discussion_points: DiscussionPoint[]
}