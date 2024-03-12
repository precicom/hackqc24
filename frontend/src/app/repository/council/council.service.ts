import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Council } from './classes';
import { Observable, delay, of } from 'rxjs';
import { MOCK_COUNCILS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class CouncilsDataService {
  http = inject(HttpClient);


  getAll(): Observable<Council[]>{ 
    // return this.http.get<Concil[]>(`${environment.apiUrl}/council`);

    // mock data
    return of(MOCK_COUNCILS).pipe(delay(500))
  }

  getById(CouncilId: number): Observable<Council> {
    // return this.http.get<Council>(`${environment.apiUrl}/council/${CouncilId}`);

    return of(MOCK_COUNCILS[0]).pipe(delay(500))
  }

  getLatestCouncilThemes(): Observable<Council[]>{
    // return this.http.get<Concil[]>(`${environment.apiUrl}/council`);

    return of(MOCK_COUNCILS.slice(0, 3)).pipe(delay(500))
  }
}
