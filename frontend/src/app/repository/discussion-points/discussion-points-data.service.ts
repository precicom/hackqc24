import { Injectable, inject } from '@angular/core'
import { AuthService } from '../../auth/auth.service'
import { DiscussionPoint } from './classes'
import { HttpClient } from '@angular/common/http'
import { Observable, delay, of } from 'rxjs'
import { DISCUSSION_POINTS } from './mock-data'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class DiscussionPointsDataService {
  http = inject(HttpClient)

  getAllForCouncil(councilId): Observable<DiscussionPoint[]> {
    return this.http.get<DiscussionPoint[]>(`${environment.apiUrl}/councils/${councilId}/discussion_points`)
  }

  getLatestDiscussionPoints(): Observable<DiscussionPoint[]> {
    return this.http.get<DiscussionPoint[]>(`${environment.apiUrl}/councils/last/discussion_points`)
  }
}
