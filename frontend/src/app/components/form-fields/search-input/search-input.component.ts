import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss'
})
export class SearchInputComponent {
  @Output() valueChange = new EventEmitter<string>();


  onChange(value){
    this.valueChange.emit(value)
  }
}
