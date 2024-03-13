import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs'
import { environment } from '../../environments/environment'
import { User } from '../repository/users/classes'
import { DataServices } from '../repository/dataServices'
import jwt_decode from 'jwt-decode'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient)
  dataServices = inject(DataServices)

  authToken: string = ''
  currentUser: User
  currentUserId: number

  private isAuthenticated = new BehaviorSubject<boolean>(false)

  constructor() {
    const token = this.getToken() ?? ''
    const isLoggedIn = Boolean(token)

    if (token) {
      const decoded = jwt_decode(token)
      this.currentUserId = decoded['user_id']
    }

    this.authToken = token
    this.isAuthenticated.next(isLoggedIn)
  }

  login(email: string): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/login`, { email: email }).pipe(
      switchMap(response => {
        this.setToken(response.token)

        return this.dataServices.users.me().pipe(
          map(user => {
            this.currentUser = user
            this.currentUserId = user.id

            this.isAuthenticated.next(true)

            return true
          }),
        )
      }),
    )
  }

  logout(): void {
    this.isAuthenticated.next(false)

    this.clearToken()
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated.value
  }

  getToken() {
    return localStorage.getItem('loginToken')
  }

  setToken(token: string): void {
    localStorage.setItem('loginToken', token)

    this.authToken = token
  }

  clearToken() {
    localStorage.removeItem('loginToken')
  }
}
