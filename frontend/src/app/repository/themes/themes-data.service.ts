import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Theme } from './classes';
import { THEMES } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class ThemesDataService {
  http = inject(HttpClient);
  authService = inject(AuthService);

  getAll(): Observable<Theme[]>{
    // return this.http.get<DiscussionPoint[]>(`${this.authService.apiUrl}/discussion-point`);

    // mock data
    return of(THEMES)
  }
}
