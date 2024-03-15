import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { inject } from '@angular/core'
import { Observable, catchError, of, throwError } from 'rxjs'
import { AuthService } from './auth.service'
import { Router } from '@angular/router'

export class AuthInterceptor implements HttpInterceptor {
  authService = inject(AuthService)
  router = inject(Router)

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(
        request.clone({
          setHeaders: {
            Authorization: this.authService.authToken,
          },
        }),
      )
      .pipe(catchError(x => this.handleAuthError(x)))
  }

  handleAuthError(error): Observable<any> {
    //handle your auth error or rethrow
    if (error.status === 401) {
      this.authService.logout()
      this.router.navigateByUrl(`/sign-in`)
      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      return of(error.message) // or EMPTY may be appropriate here
    }
    return throwError(() => error)
  }
}
