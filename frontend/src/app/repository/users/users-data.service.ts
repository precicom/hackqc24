import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './classes';

@Injectable({
  providedIn: 'root'
})
export class UsersDataService {
  http = inject(HttpClient);
  authService = inject(AuthService);

  getAll(): Observable<User[]>{
    return this.http.get<User[]>(`${this.authService.apiUrl}/users`);
  }
}
