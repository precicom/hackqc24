import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './classes';
import { environment } from '../../../environments/environment';
import { Comment } from '../comments/classes';

@Injectable({
  providedIn: 'root'
})
export class PostsDataService {
  http = inject(HttpClient);
  authService = inject(AuthService);

  create(post: Partial<Post>) {
    return this.http.post<Post>(`${environment.apiUrl}/posts`, { post })
  }

  getById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${environment.apiUrl}/posts/${postId}`)
  }

  comments(postId: number) {
    return this.http.get<Comment[]>(`${environment.apiUrl}/posts/${postId}/comments`)
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
