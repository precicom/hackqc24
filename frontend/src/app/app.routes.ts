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
import { PostListComponent } from './components/post/post-list/post-list.component';
import { PostsHomeComponent } from './components/post/posts-home/posts-home.component';
import { MyPostsComponent } from './components/post/my-posts/my-posts.component';
import { CreatePostComponent } from './components/post/create-post/create-post.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

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
            data: { title: 'Home' },        
          },
          {
            path: 'councils',
            component: CouncilListComponent,       
            data: { title: 'Councils' },        
          },
          {
            path: 'councils/:councilId',
            component: CouncilFicheComponent,
            data: { title: 'Council Details' },     
          },
          {
            path: 'themes',
            component: ThemeListComponent,
            data: { title: 'Themes' },     
          },
          {
            path: 'posts',
            redirectTo: 'posts/my-posts',
            pathMatch: 'full'
          },
          {
            path: 'posts',
            component: PostsHomeComponent,
        
            data: { title: 'Posts' },   
            children: [
              {
                path: 'my-posts',
                component: MyPostsComponent,
                data: { title: 'My posts' },     
              },
              {
                path: 'all-posts',
                component: PostListComponent,
                data: { title: 'All posts' },     
              },
              {
                path:'create',
                component: CreatePostComponent,
                data: { title: 'Create a Post' },     
              }
            ]
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
