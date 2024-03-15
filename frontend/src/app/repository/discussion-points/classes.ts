import { Council } from '../council/classes'
import { Theme } from '../themes/classes'

export interface DiscussionPoint {
  id: number
  title: string
  generated_summary: string
  council_id: number
  theme_id: number
  theme: Theme
  minute_link_url: string

  council?: Council
}
