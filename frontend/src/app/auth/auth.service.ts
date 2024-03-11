import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient)

  authToken: string = ''

  private isAuthenticated = new BehaviorSubject<boolean>(false)

  constructor() {
    const isLoggedIn = Boolean(this.getToken())
    this.isAuthenticated.next(isLoggedIn)
  }

  login(email: string): Observable<boolean> {
    return this.http.post(`${environment.apiUrl}/auth/token`, {email: email}).pipe(     
      map(token => {
        this.setToken(token)       

        this.isAuthenticated.next(true)

        return true
      })
    );
  }

  logout(): void {
    this.isAuthenticated.next(false);

    this.clearToken()
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }  

  getToken(){
    return localStorage.getItem('loginToken')
  }

  setToken(token: Object): void {
    const tokenString =  JSON.stringify(token)
    localStorage.setItem('loginToken', tokenString)

    this.authToken = tokenString
  }

  clearToken(){
    localStorage.removeItem('loginToken')
  }
}
