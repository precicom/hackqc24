import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './classes';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersDataService {
  http = inject(HttpClient);

  me(){
    return this.http.get<User>(`${environment.apiUrl}/users/me`);  
  }

  create(user: User): Observable<User>{
    return this.http.post<User>(`${environment.apiUrl}/users`, user);
  }

  getAll(): Observable<User[]>{
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }
}
