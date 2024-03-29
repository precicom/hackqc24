import { Component, OnInit, inject } from '@angular/core'
import { RouterModule } from '@angular/router'
import { DataServices } from '../../../repository/dataServices'
import { BehaviorSubject, Subject, combineLatest, delay } from 'rxjs'
import { Council } from '../../../repository/council/classes'
import { CommonModule } from '@angular/common'
import { Theme } from '../../../repository/themes/classes'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { ThemeFilterComponent } from '../../theme/theme-filter/theme-filter.component'
import { SearchInputComponent } from '../../form-fields/search-input/search-input.component'
import { CouncilCardComponent } from '../council-card/council-card.component'
import { fadeIn, slideAndFadeIn, staggeredFadeIn } from '../../../animations/animations'

@UntilDestroy()
@Component({
  selector: 'app-council-list',
  standalone: true,
  templateUrl: './council-list.component.html',
  styleUrl: './council-list.component.scss',
  animations: [slideAndFadeIn, fadeIn, staggeredFadeIn],
  imports: [RouterModule, CommonModule, ThemeFilterComponent, SearchInputComponent, CouncilCardComponent],
})
export class CouncilListComponent implements OnInit {
  dataServices = inject(DataServices)

  /** the list of councils after having been filtered and sorted */
  councilsList$ = new Subject<Council[]>()

  search$ = new BehaviorSubject<string>('')
  themes$ = new BehaviorSubject<Theme[]>([])
  councils$ = new BehaviorSubject<Council[]>([])
  selectedThemes$ = new BehaviorSubject<Theme[]>([])

  setSearch(value: string) {
    this.search$.next(value)
  }

  setSelectedThemes(themes: Theme[]) {
    this.selectedThemes$.next(themes)
  }

  ngOnInit(): void {
    this.dataServices.themes.getAll().subscribe(themes => {
      this.themes$.next(themes)
    })

    this.dataServices.councils
      .getAll()
      .pipe(delay(500))
      .subscribe(councils => {
        this.councils$.next(councils)
      })

    combineLatest([this.councils$, this.selectedThemes$, this.search$])
      .pipe(untilDestroyed(this))
      .subscribe(([councils, selectedThemes, search]) => {
        let filteredCouncils = councils

        // filter by user search input
        if (search) {
          filteredCouncils = filteredCouncils.filter(council => {
            const allThemeText = council.themes.reduce((acc, theme) => `${acc} ${theme.name} ${theme.category}`, '');

            return `${council.generated_summary} ${council.title} ${allThemeText}`.toLowerCase().includes(search.toLowerCase())
          })
        }

        // filter by user selected themes
        if (selectedThemes.length) {
          const selectedThemeIds = selectedThemes.map(theme => theme.id)

          filteredCouncils = filteredCouncils.filter(council => {
            const themeIds = council.discussion_points.map(dp => dp.theme_id)

            return selectedThemeIds.some(selectedThemeId => themeIds.includes(selectedThemeId))
          })
        }

        this.councilsList$.next(filteredCouncils)
      })
  }
}
