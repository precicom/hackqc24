import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component'; // Adjust the path as necessary
import { HomeComponent } from './home/home.component'; // Adjust the path as necessary
import { inject } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { MobileFrameComponent } from './layouts/mobile-frame/mobile-frame.component';
import { ConseilListComponent } from './conseil/conseil-list/conseil-list.component';
import { ThemeListComponent } from './theme/theme-list/theme-list.component';
import { ConseilFicheComponent } from './conseil/conseil-fiche/conseil-fiche.component';

export const routes: Routes = [
  {
    path: '',
    component: MobileFrameComponent, // remove this line to remove mobile frame layout
    children: [
      { path: 'sign-in', component: SignInComponent },
      {
        path: '',
        canActivate: [() => inject(AuthGuard).canActivate()],
        component: MainLayoutComponent,
        children: [
          {
            path: 'home',
            component: HomeComponent,          
          },
          {
            path: 'conseils',
            component: ConseilListComponent,           
          },
          {
            path: 'conseils/:conseilId',
            component: ConseilFicheComponent,
          },
          {
            path: 'themes',
            component: ThemeListComponent
          },
          {
            path: '**',
            redirectTo: '/home',
            pathMatch: 'full',
          },
        ],
      },
      { path: '**', redirectTo: '/sign-in', pathMatch: 'full' },
    ]
  } 
];
