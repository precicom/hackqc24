import { Pipe, PipeTransform } from '@angular/core'
import lodash from 'lodash'

@Pipe({
  name: 'sortBy',
  standalone: true,
})
export class SortByPipe implements PipeTransform {
  transform(array: any[], sortBy: ((a, b) => number) | string, modifier: 'reverse' = null ): any[] {
    const sortedArray = this.sort(array, sortBy)

    return modifier === 'reverse' ? sortedArray.reverse() : sortedArray
  }

  sort(array: any[], sortBy: ((a, b) => number) | string) {
    if(typeof sortBy === 'function'){     
      return Array.isArray(array) ? array.sort(sortBy) : array
    }else if(typeof sortBy === 'string'){
      return lodash.sortBy(array, item => lodash.get(item, sortBy))
    }    
  }
}
