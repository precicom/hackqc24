import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';
import { Theme } from './classes';
import { THEMES } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class ThemesDataService {
  http = inject(HttpClient);
  authService = inject(AuthService);

  getAll(): Observable<Theme[]>{
    // return this.http.get<DiscussionPoint[]>(`${environment.apiUrl}/discussion-point`);

    // mock data
    return of(THEMES).pipe(delay(500))
  }

  /** Top X themes as measured by activity (comments and upvotes) */
  popularThemes(): Observable<Theme[]>{
    return of(THEMES.slice(0, 5)).pipe(delay(500))
  }
}
