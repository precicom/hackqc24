import { Component, Input, OnInit, inject, numberAttribute } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { BehaviorSubject, Subject, combineLatest, delay } from 'rxjs';
import { Council } from '../../../repository/council/classes';
import { CommonModule } from '@angular/common';
import { fadeIn, slideAndFadeIn, staggeredFadeIn } from '../../../animations/animations';
import { SearchInputComponent } from "../../form-fields/search-input/search-input.component";
import { ThemeFilterComponent } from "../../theme/theme-filter/theme-filter.component";
import { Theme } from '../../../repository/themes/classes';
import { DiscussionPoint } from '../../../repository/discussion-points/classes';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DiscussionPointCardComponent } from "../discussion-point-card/discussion-point-card.component";
import { TranslateModule } from '@ngx-translate/core';

@UntilDestroy()
@Component({
    selector: 'app-council-fiche',
    standalone: true,
    templateUrl: './council-fiche.component.html',
    animations: [slideAndFadeIn, fadeIn, staggeredFadeIn],
    styleUrl: './council-fiche.component.scss',
    imports: [CommonModule, SearchInputComponent, ThemeFilterComponent, DiscussionPointCardComponent]
})
export class CouncilFicheComponent implements OnInit {
  @Input({transform: numberAttribute}) councilId?: number;

  dataServices = inject(DataServices)

  discussionPoints$ = new BehaviorSubject<DiscussionPoint[]>([])
  council$ = new Subject<Council>()
  search$ = new BehaviorSubject<string>('')
  themes$= new BehaviorSubject<Theme[]>([])
  selectedThemes$ = new BehaviorSubject<Theme[]>([])

  ngOnInit(): void {
    this.dataServices.themes.getAll().subscribe(themes => {
      this.themes$.next(themes)
    })

    if(typeof this.councilId === 'number'){
      this.fetchCouncil(this.councilId)
    }

    combineLatest([
      this.selectedThemes$,
      this.search$,
      this.discussionPoints$
    ]).pipe(
      untilDestroyed(this)
    ).subscribe(([selectedThemes, search, discussionPoints]) => {

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
