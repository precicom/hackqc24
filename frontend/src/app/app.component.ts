import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { PageInformation } from './services/page-information';
import english from './locales/en'
import french from './locales/fr'
import { TranslateService } from '@ngx-translate/core'

const locales = {
  en: english,
  fr: french,
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)
  pageInfoService = inject(PageInformation)
  translate = inject(TranslateService)
  
  title = 'frontend';

  ngOnInit(): void {
    this.trackRouterTitleDate()
    this.initTranslations()
  }

  initTranslations(){
    Object.keys(locales).forEach(locale => {
      this.translate.setTranslation(locale, locales[locale])
    })
    this.translate.setDefaultLang('fr')
    this.translate.use('fr')
  }

  trackRouterTitleDate(){
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild
        }
        return route
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data),
      filter(data => !!data['title']),
    )
    .subscribe(data => {
      this.title = data['title']

      this.pageInfoService.setPagetitle(this.title)
    })
  }
}
