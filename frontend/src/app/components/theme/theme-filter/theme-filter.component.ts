import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Theme } from '../../../repository/themes/classes';
import { BehaviorSubject } from 'rxjs';
import { SortThemesPipe } from './sort-themes.pipe';

@Component({
  selector: 'app-theme-filter',
  standalone: true,
  imports: [SortThemesPipe],
  templateUrl: './theme-filter.component.html',
  styleUrl: './theme-filter.component.scss'
})
export class ThemeFilterComponent implements OnChanges {
  @Input() selectedThemes: Theme[]
  @Input() themes: Theme[]
  @Output() selectedThemesChange = new EventEmitter<Theme[]>()

  selectedThemes$ = new BehaviorSubject<Theme[]>([])

  get selectedThemeIds(){
    return this.selectedThemes?.map(theme => theme.id) ?? []
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { selectedThemes } = changes

    if(selectedThemes?.currentValue){
      this.selectedThemes$.next(selectedThemes.currentValue)
    }
  }

  toggleTheme(theme: Theme){
    if(this.selectedThemes.some(t => t.id === theme.id)){
      this.selectedThemes$.next( this.selectedThemes.filter(t => t.id !== theme.id))
    }else {
      this.selectedThemes$.next([...this.selectedThemes, theme])
    }

    this.selectedThemesChange.emit(this.selectedThemes$.value)
  }
}
