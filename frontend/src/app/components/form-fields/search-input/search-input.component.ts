import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { growShrink } from '../../../animations/animations';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  animations: [growShrink]
})
export class SearchInputComponent {
  @ViewChild('input') input: ElementRef<HTMLInputElement>
  @Output() valueChange = new EventEmitter<string>();

  value: string = ''
  active: boolean = false

  onChange(value){
    this.value = value
    this.valueChange.emit(value)
  }

  toggle(){
    this.active = !this.active
  }

  escape(value: string){
    this.onChange('')

    this.active = false

    // this.input.nativeElement.blur()
  }

  onBlur(){
    if(!this.value) {
      this.active = false
    }
  }
}
