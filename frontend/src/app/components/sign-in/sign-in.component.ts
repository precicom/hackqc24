import { Component, OnInit, inject } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { AuthService } from '../../auth/auth.service'
import { CommonModule } from '@angular/common'
import { FacebookService } from 'ngx-facebook'

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit {
  fb = inject(FacebookService)
  authService = inject(AuthService)
  router = inject(Router)

  signInForm: FormGroup

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    })
  }

  loginWithFacebook(): void {
    this.fb
      .login({ scope: 'public_profile,email' })
      .then(response => {
        this.authService.loginFb(response.authResponse.accessToken).subscribe(() => {
          this.router.navigate(['/'])
        })
      })
      .catch((error: any) => console.error(error))
  }

  onSignIn() {
    const email = this.signInForm.get('email')?.value
    this.authService.login(email).subscribe(() => {
      console.log('loggin')
      this.router.navigate(['/'])
    })
  }
}
