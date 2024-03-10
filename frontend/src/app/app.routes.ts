import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component'; // Adjust the path as necessary
import { HomeComponent } from './home/home.component'; // Adjust the path as necessary
import { inject } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  {
    path: '',
    canActivate: [() => inject(AuthGuard).canActivate()],
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [() => inject(AuthGuard).canActivate()],
      },
      { 
        path: '**', 
        redirectTo: '/home', 
        pathMatch: 'full' 
      }
    ]
  },
  { path: '**', redirectTo: '/sign-in', pathMatch: 'full' },
];
