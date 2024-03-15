import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Council } from './classes'
import { Observable } from 'rxjs'
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
}
