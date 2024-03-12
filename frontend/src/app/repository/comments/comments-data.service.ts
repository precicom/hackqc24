import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Comment } from './classes';

@Injectable({
  providedIn: 'root'
})
export class CommentsDataService {
  http = inject(HttpClient);
  authService = inject(AuthService);

  create(comment: Partial<Comment> | FormData) {
    return this.http.post<Comment>(`${environment.apiUrl}/comments`, comment)
  }
}
