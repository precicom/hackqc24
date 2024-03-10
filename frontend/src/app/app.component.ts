import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { PageInformation } from './services/page-information';

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
  
  title = 'frontend';

  ngOnInit(): void {
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
