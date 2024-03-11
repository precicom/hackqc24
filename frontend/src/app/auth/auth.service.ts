import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  authToken: string  = ''

  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor() {
    const token = this.getToken() ?? ''
    const isLoggedIn = Boolean(token)

    this.authToken = token
    this.isAuthenticated.next(isLoggedIn)
  }

  login(email: string): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/login`, {email: email}).pipe(     
      map(response => {
        this.setToken(response.token)       

        this.isAuthenticated.next(true);

        return true;
      })
    );
  }

  logout(): void {
    this.isAuthenticated.next(false);

    this.clearToken();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }

  getToken() {
    return localStorage.getItem('loginToken');
  }

  setToken(token: string): void {
    localStorage.setItem('loginToken', token)

    this.authToken = token
  }

  clearToken() {
    localStorage.removeItem('loginToken');
  }
}
