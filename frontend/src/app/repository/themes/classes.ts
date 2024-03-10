export interface Theme {
  id: number,
  name: string,
  category: Categories
}

export type Categories = 
'territoire' | 
'soumissions' | 
'affaires_juridiques' |
'direction_generalte' 
// ...