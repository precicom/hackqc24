import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { Observable } from 'rxjs';
import { Post } from '../../../repository/posts/classes';
import { RouterModule } from '@angular/router';
import { CreatePostComponent } from '../create-post/create-post.component';
import { PostUpVoteCountPipe } from '../pipes/post-up-vote-count.pipe';
import { PostCommentCountPipe } from '../pipes/post-comment-count.pipe';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, CreatePostComponent, PostUpVoteCountPipe, PostCommentCountPipe],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss'
})
export class MyPostsComponent implements OnInit {
  dataServices = inject(DataServices)
  posts?: Post[]

  posts$: Observable<Post[]> = this.dataServices.posts.getMyPosts() 

  ngOnInit(): void {
    this.refreshList()
  }

  postCreated(){
    this.refreshList()
  }

  refreshList(){
    this.dataServices.posts.getMyPosts().subscribe(posts => {
      this.posts = posts
    })
  }
}
