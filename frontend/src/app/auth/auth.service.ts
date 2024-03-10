import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor() {  
    // Check the authentication status from local storage on service initialization
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isAuthenticated.next(isLoggedIn);
  }

  login(email: string): Observable<boolean> {
    return of(true).pipe(
      tap(() => {
        this.isAuthenticated.next(true);

        // Save authentication status to local storage
        localStorage.setItem('isLoggedIn', 'true');
      })
    );
  }

  logout(): void {
    this.isAuthenticated.next(false);

    // Remove authentication status from local storage
    localStorage.removeItem('isLoggedIn');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }
  
}
