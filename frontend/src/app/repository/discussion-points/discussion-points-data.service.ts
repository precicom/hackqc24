import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { DiscussionPoint } from './classes';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DISCUSSION_POINTS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class DiscussionPointsDataService {
  http = inject(HttpClient);
  authService = inject(AuthService);

  getAll(): Observable<DiscussionPoint[]>{
    // return this.http.get<DiscussionPoint[]>(`${this.authService.apiUrl}/discussion-point`);

    // mock data
    return of(DISCUSSION_POINTS)
  }
}
