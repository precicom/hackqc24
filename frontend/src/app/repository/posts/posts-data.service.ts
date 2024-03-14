// import { WebsocketService } from './../../services/websocket.service'
import { Injectable, inject } from '@angular/core'
import { AuthService } from '../../auth/auth.service'
import { HttpClient } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { Post } from './classes'
import { environment } from '../../../environments/environment'
import { Comment } from '../comments/classes'

@Injectable({
  providedIn: 'root',
})
export class PostsDataService {
  http = inject(HttpClient)
  //websocketService = inject(WebsocketService)

  create(post: FormData) {
    return this.http.post<Post>(`${environment.apiUrl}/posts`, post)
  }

  getById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${environment.apiUrl}/posts/${postId}`)
  }

  comments(postId: number) {
    return this.http.get<Comment[]>(`${environment.apiUrl}/posts/${postId}/comments`)
  }

  upVote(postId: number) {
    return this.http
      .post(`${environment.apiUrl}/posts/${postId}/up_vote`, {})
      //.pipe(tap(() => this.websocketService.sendRefreshPost(postId)))
  }

  downVote(postId: number) {
    return this.http
      .post(`${environment.apiUrl}/posts/${postId}/down_vote`, {})
      //.pipe(tap(() => this.websocketService.sendRefreshPost(postId)))
  }

  getMyPosts() {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts/my_posts`)
  }

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts`)
  }
}
