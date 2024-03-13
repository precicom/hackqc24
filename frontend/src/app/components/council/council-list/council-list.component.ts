import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataServices } from '../../../repository/dataServices';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { Council } from '../../../repository/council/classes';
import { CommonModule } from '@angular/common';
import { Theme } from '../../../repository/themes/classes';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-council-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './council-list.component.html',
  styleUrl: './council-list.component.scss'
})
export class CouncilListComponent implements OnInit {
  dataServices = inject(DataServices)

  /** the list of councils after having been filtered and sorted */
  councilsList$ = new Subject<Council[]>()

  search$ = new BehaviorSubject<string>('')
  themes$= new BehaviorSubject<Theme[]>([])
  councils$ = new BehaviorSubject<Council[]>([])
  selectedThemes$ = new BehaviorSubject<Theme[]>([])

  get selectedThemes(){
    return this.selectedThemes$.value
  }

  get selectedThemeIds(){
    return this.selectedThemes.map(theme => theme.id)  
  }

  ngOnInit(): void {
    this.dataServices.themes.getAll().subscribe(themes => {
      this.themes$.next(themes)
    })

    this.dataServices.councils.getAll().subscribe(councils => {
      this.councils$.next(councils)
    })

    combineLatest([    
      this.councils$,
      this.selectedThemes$,
      this.search$
    ]).pipe(
      untilDestroyed(this)
    ).subscribe(([councils, selectedThemes, search]) => {
      let filteredCouncils = councils

      // filter by user search input
      if(search){     
        filteredCouncils = filteredCouncils.filter(council => `${council.generated_summary} ${council.title}`.toLowerCase().includes(search.toLowerCase()))
      }

      // filter by user selected themes
      if(selectedThemes.length){
        const selectedThemeIds = selectedThemes.map(theme => theme.id)

        filteredCouncils = filteredCouncils.filter(council => {
          const themeIds = council.discussion_points.map(dp => dp.theme_id)

          return selectedThemeIds.some(selectedThemeId => themeIds.includes(selectedThemeId))
        })
      }

      this.councilsList$.next(filteredCouncils)
    })
  }

  toggleTheme(theme: Theme){
    if(this.selectedThemes.some(t => t.id === theme.id)){
      this.selectedThemes$.next( this.selectedThemes.filter(t => t.id !== theme.id))
    }else {
      this.selectedThemes$.next([...this.selectedThemes, theme])
    }
  }
}
