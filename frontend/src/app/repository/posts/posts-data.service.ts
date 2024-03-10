import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './classes';

@Injectable({
  providedIn: 'root'
})
export class PostsDataService {
  http = inject(HttpClient);
  authService = inject(AuthService);

  getAll(): Observable<Post[]>{
    return this.http.get<Post[]>(`${this.authService.apiUrl}/posts`);
  }
}
