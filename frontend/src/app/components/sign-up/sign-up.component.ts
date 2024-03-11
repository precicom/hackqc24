import { CommonModule } from '@angular/common';
import { Component, ComponentFactoryResolver, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { DataServices } from '../../repository/dataServices';
import { catchError } from 'rxjs';
import { ROUTES } from '../../helpers/constants';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent { 
  dataServices = inject(DataServices)
  authService = inject(AuthService)
  router = inject(Router)

  signUpForm: FormGroup

  constructor() {
    this.signUpForm = new FormGroup({
     // name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),    
    });
  }

  submit(){
    this.dataServices.users.create(this.signUpForm.value).subscribe(response => {
      this.authService.login(this.signUpForm.value.email).subscribe(() => {
        this.router.navigate([ROUTES.home])
      })
    })
  }
}
