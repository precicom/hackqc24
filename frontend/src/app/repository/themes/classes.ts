import { Post } from '../posts/classes'

export interface Theme {
  id: number
  name: string
  category: Categories
  posts?: Post[]
  score?: number
}

export type Categories = 'territoire' | 'soumissions' | 'affaires_juridiques' | 'direction_generalte'
// ...
