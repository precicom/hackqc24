import { Pipe, PipeTransform } from '@angular/core';
import { Theme } from '../../../repository/themes/classes';

@Pipe({
  name: 'sortThemes',
  standalone: true
})
export class SortThemesPipe implements PipeTransform {

  transform(themes: Theme[] = []): Theme[] {
    if(Array.isArray(themes) ){
      return [...themes].sort((a,b) => a.name.localeCompare(b.name))
    }else {
      return []
    }   
  }
}
