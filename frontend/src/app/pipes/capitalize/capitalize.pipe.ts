import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true
})
export class CapitalizePipe implements PipeTransform {

  transform(value: string): string {
    if(value == null || typeof value !== 'string') return value // not a string
    if(value.length === 0) return value // empty string

    return `${value[0].toLocaleUpperCase()}${value.slice(1)}`
  }

}
