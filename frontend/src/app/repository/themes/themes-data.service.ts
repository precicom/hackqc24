import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Theme } from './classes'
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
