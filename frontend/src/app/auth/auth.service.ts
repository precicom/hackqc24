import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor() {}

  login(email: string): Observable<boolean> {
    return of(true).pipe(
      tap(() => {
        this.isAuthenticated.next(true);
      })
    );
  }

  logout(): void {
    this.isAuthenticated.next(false);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }
}
