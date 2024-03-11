import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';
import { Post } from './classes';
import { MOCK_POSTS } from './mock-data';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsDataService {
  http = inject(HttpClient);
  authService = inject(AuthService);

  create(post: Partial<Post>) {
    this.http.post(`${environment.apiUrl}/posts`, { post }).subscribe();
  }

  getMyPosts(){
     return this.http.get<Post[]>(`${environment.apiUrl}/posts/my_posts`);

     // return of(MOCK_POSTS.slice(0, 3)).pipe(delay(500))
  }

  getAll(): Observable<Post[]>{
    return this.http.get<Post[]>(`${environment.apiUrl}/posts`);

    // return of(MOCK_POSTS).pipe(delay(500))
  }
}
