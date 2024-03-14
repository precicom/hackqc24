import { Component, Input, OnInit, inject, numberAttribute } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { BehaviorSubject, ReplaySubject, Subject, combineLatest, delay } from 'rxjs';
import { Council } from '../../../repository/council/classes';
import { CommonModule } from '@angular/common';
import { fadeIn, slideAndFadeIn, staggeredFadeIn } from '../../../animations/animations';
import { SearchInputComponent } from "../../form-fields/search-input/search-input.component";
import { ThemeFilterComponent } from "../../theme/theme-filter/theme-filter.component";
import { Theme } from '../../../repository/themes/classes';
import { DiscussionPoint } from '../../../repository/discussion-points/classes';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DiscussionPointCardComponent } from "../discussion-point-card/discussion-point-card.component";
import { RouterModule } from '@angular/router';

@UntilDestroy()
@Component({
    selector: 'app-council-fiche',
    standalone: true,
    templateUrl: './council-fiche.component.html',
    animations: [slideAndFadeIn, fadeIn, staggeredFadeIn],
    styleUrl: './council-fiche.component.scss',
    imports: [CommonModule, SearchInputComponent, ThemeFilterComponent, DiscussionPointCardComponent, RouterModule]
})
export class CouncilFicheComponent implements OnInit {
  @Input({transform: numberAttribute}) councilId?: number;
  @Input({ transform: numberAttribute }) set themeId(themeId: number) {
    this.activeThemeId$.next(themeId)
  }

  dataServices = inject(DataServices)

  activeThemeId$ = new BehaviorSubject<number>(null)
  filteredPoints$ = new BehaviorSubject<DiscussionPoint[]>([])
  discussionPoints$ = new BehaviorSubject<DiscussionPoint[]>([])
  council$ = new Subject<Council>()
  search$ = new BehaviorSubject<string>('')
  themes$= new ReplaySubject<Theme[]>(1)
  selectedThemes$ = new BehaviorSubject<Theme[]>([])

  ngOnInit(): void {
    this.dataServices.themes.getAll().subscribe(themes => {
      this.themes$.next(themes)
    })

    if(typeof this.councilId === 'number'){
      this.fetchCouncil(this.councilId)
    }

    combineLatest([this.activeThemeId$, this.themes$])
    .pipe(untilDestroyed(this))
    .subscribe(([activeThemeId, themes]) => {
      if (activeThemeId) {
        this.setSelectedThemes([themes.find(theme => theme.id === activeThemeId)])
      } else {
        this.setSelectedThemes([])
      }
    })

    combineLatest([
      this.selectedThemes$,
      this.search$,
      this.discussionPoints$
    ]).pipe(
      untilDestroyed(this)
    ).subscribe(([selectedThemes, search, discussionPoints]) => {
      let filteredPoints = discussionPoints

      // filter by user search input
      if(search){     
        filteredPoints = filteredPoints.filter(point => `${point.generated_summary} ${point.theme.category} ${point.theme.name}`.toLowerCase().includes(search.toLowerCase()))
      }

      // filter by user selected themes
      if(selectedThemes.length){
        const selectedThemeIds = selectedThemes.map(theme => theme.id)

        filteredPoints = filteredPoints.filter(point => selectedThemeIds.some(selectedThemeId => selectedThemeId === point.theme_id) )
      }

      this.filteredPoints$.next(filteredPoints)
    })
  }

  
  setSearch(value: string){
    this.search$.next(value)  
  }

  setSelectedThemes(themes: Theme[]){
    this.selectedThemes$.next(themes)
  }

  fetchCouncil(councilId: number){
    this.dataServices.councils.getById(councilId).pipe(delay(500)).subscribe(council => {
      this.council$.next(council)
      this.discussionPoints$.next(council.discussion_points)      
    })
  }
}
