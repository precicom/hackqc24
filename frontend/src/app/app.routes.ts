import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component'; // Adjust the path as necessary
import { inject } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';
import { ThemeListComponent } from './components/theme/theme-list/theme-list.component';
import { CouncilFicheComponent } from './components/council/council-fiche/council-fiche.component';
import { MobileFrameComponent } from './components/layouts/mobile-frame/mobile-frame.component';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { CouncilListComponent } from './components/council/council-list/council-list.component';

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
            path: 'councils',
            component: CouncilListComponent,           
          },
          {
            path: 'councils/:councilId',
            component: CouncilFicheComponent,
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
