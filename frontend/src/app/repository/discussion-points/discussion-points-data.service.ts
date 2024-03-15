import { Injectable, inject } from '@angular/core'
import { DiscussionPoint } from './classes'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class DiscussionPointsDataService {
  http = inject(HttpClient)

  getAll(){
    return this.http.get<DiscussionPoint[]>(`${environment.apiUrl}/discussion_points`)
  }

  getAllForCouncil(councilId): Observable<DiscussionPoint[]> {
    return this.http.get<DiscussionPoint[]>(`${environment.apiUrl}/councils/${councilId}/discussion_points`)
  }

  getLatestDiscussionPoints(): Observable<DiscussionPoint[]> {
    return this.http.get<DiscussionPoint[]>(`${environment.apiUrl}/councils/last/discussion_points`)
  }
}
