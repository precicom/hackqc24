import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Council } from './classes'
import { Observable, delay, of } from 'rxjs'
import { MOCK_COUNCILS } from './mock-data'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class CouncilsDataService {
  http = inject(HttpClient)

  getAll(): Observable<Council[]> {
    return this.http.get<Council[]>(`${environment.apiUrl}/councils`)
  }

  getById(CouncilId: number): Observable<Council> {
    return this.http.get<Council>(`${environment.apiUrl}/councils/${CouncilId}`)
  }

  // getLatestCouncilThemes(): Observable<Council[]> {
  //   return this.http.get<Concil[]>(`${environment.apiUrl}/council`);

  //   return of(MOCK_COUNCILS.slice(0, 3)).pipe(delay(500))
  // }
}
