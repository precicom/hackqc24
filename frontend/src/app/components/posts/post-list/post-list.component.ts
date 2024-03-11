import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { Observable } from 'rxjs';
import { Post } from '../../../repository/posts/classes';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent {
  dataServices = inject(DataServices)

  posts$: Observable<Post[]> = this.dataServices.posts.getAll() 
}
