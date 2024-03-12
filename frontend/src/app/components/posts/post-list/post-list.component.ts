import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { Observable } from 'rxjs';
import { Post } from '../../../repository/posts/classes';
import { PostCardComponent } from "../post-card/post-card.component";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-post-list',
    standalone: true,
    templateUrl: './post-list.component.html',
    styleUrl: './post-list.component.scss',
    imports: [CommonModule, PostCardComponent, RouterModule]
})
export class PostListComponent {
  dataServices = inject(DataServices)

  posts$: Observable<Post[]> = this.dataServices.posts.getAll() 
}
