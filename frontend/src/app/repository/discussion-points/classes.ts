import { Theme } from "../themes/classes"

export interface DiscussionPoint {
  id: number,
  generated_summary: string,
  council_id: number,
  theme_id: number,
  theme: Partial<Theme>
  minute_link_url: string
}