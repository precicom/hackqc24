import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component'; // Adjust the path as necessary
import { inject } from '@angular/core';
import { AuthGuard } from './auth/auth.guard';
import { ThemeListComponent } from './components/theme/theme-list/theme-list.component';
import { CouncilFicheComponent } from './components/council/council-fiche/council-fiche.component';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { CouncilListComponent } from './components/council/council-list/council-list.component';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { PostsHomeComponent } from './components/posts/posts-home/posts-home.component';
import { MyPostsComponent } from './components/posts/my-posts/my-posts.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PostShowComponent } from './components/posts/post-show/post-show.component';

export const routes: Routes = [
  {
    path: '',
    // component: MobileFrameComponent, // remove this line to remove mobile frame layout
    children: [
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      {
        path: '',
        canActivate: [() => inject(AuthGuard).canActivate()],
        component: MainLayoutComponent,
        children: [
          {
            path: 'home',
            component: HomeComponent,  
            data: { title: 'Accueil' },        
          },
          {
            path: 'councils',
            component: CouncilListComponent,       
            data: { title: 'Séances publiques' },        
          },
          {
            path: 'councils/:councilId',
            component: CouncilFicheComponent,
            data: { title: 'Détails de la séance' },     
          },
          {
            path: 'themes',
            component: ThemeListComponent,
            data: { title: 'Thèmes' },     
          },
          {
            path: 'posts',
            redirectTo: 'posts/my-posts',
            pathMatch: 'full'
          },
          {
            path: 'posts',
            component: PostsHomeComponent,
        
            data: { title: 'Propositions' },   
            children: [
              {
                path: 'my-posts',
                component: MyPostsComponent,
                data: { title: 'Mes propositions' },                   
              },            
              {
                path: 'all-posts',
                component: PostListComponent,
                data: { title: 'Ma communauté' },     
              },            
            ]
          },
          {
            path: 'posts/my-posts/:postId',
            component: PostShowComponent,
            data: { title: 'Détails de la proposition' },
          },
          {
            path: 'posts/all-posts/:postId',
            component: PostShowComponent,
            data: { title: 'Détails de la proposition' },
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
