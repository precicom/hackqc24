import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Council } from './classes';
import { Observable, delay, of } from 'rxjs';
import { MOCK_CONCILS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class CouncilsDataService {
  http = inject(HttpClient);
  authService = inject(AuthService);


  getAll(): Observable<Council[]>{ 
    // return this.http.get<Concil[]>(`${this.authService.apiUrl}/council`);

    // mock data
    return of(MOCK_CONCILS).pipe(delay(500))
  }

  getLatestCouncilThemes(): Observable<Council[]>{
    // return this.http.get<Concil[]>(`${this.authService.apiUrl}/council`);

    return of(MOCK_CONCILS.slice(0, 3)).pipe(delay(500))
  }
}
