import { DiscussionPoint } from "../discussion-points/classes"
import { Theme } from "../themes/classes"

export interface Council {
  id: number,
  title: string,
  date: string,
  youtube_link: string,
  generated_summary: string
  discussion_points: DiscussionPoint[]

  /** theme for all discussion points */
  themes?: Theme[]
}