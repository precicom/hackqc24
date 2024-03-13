import { Injectable, inject } from '@angular/core'
import { AuthService } from '../../auth/auth.service'
import { HttpClient } from '@angular/common/http'
import { Observable, delay, of } from 'rxjs'
import { Theme } from './classes'
import { THEMES } from './mock-data'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ThemesDataService {
  http = inject(HttpClient)

  getAll(): Observable<Theme[]> {
    return this.http.get<Theme[]>(`${environment.apiUrl}/themes`)
  }

  /** Top X themes as measured by activity (comments and upvotes) */
  popularThemes(): Observable<Theme[]> {
    return this.http.get<Theme[]>(`${environment.apiUrl}/themes/popular`)
  }
}
