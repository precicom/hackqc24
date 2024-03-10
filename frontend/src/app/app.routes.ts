import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'; // Adjust the path as necessary
import { inject } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';
import { ConseilListComponent } from './components/conseil/conseil-list/conseil-list.component';
import { ThemeListComponent } from './components/theme/theme-list/theme-list.component';
import { ConseilFicheComponent } from './components/conseil/conseil-fiche/conseil-fiche.component';
import { MobileFrameComponent } from './components/layouts/mobile-frame/mobile-frame.component';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

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
