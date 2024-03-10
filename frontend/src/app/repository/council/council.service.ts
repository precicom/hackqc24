import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Concil } from './classes';
import { Observable, of } from 'rxjs';
import { MOCK_CONCILS } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class CouncilsDataService {
  http = inject(HttpClient);
  authService = inject(AuthService);


  getAll(): Observable<Concil[]>{ 
    // return this.http.get<Concil[]>(`${this.authService.apiUrl}/council`);

    // mock data
    return of(MOCK_CONCILS)
  }
}
