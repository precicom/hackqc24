import { Component, Input, inject, numberAttribute } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { Post } from '../../../repository/posts/classes';
import { TimeDiffProPipe } from "../../../pipes/time-diff-pro/time-diff-pro.pipe";
import { PostCommentCountPipe } from "../pipes/post-comment-count.pipe";
import { PostUpVoteCountPipe } from "../pipes/post-up-vote-count.pipe";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-post-show',
    standalone: true,
    templateUrl: './post-show.component.html',
    styleUrl: './post-show.component.scss',
    imports: [TimeDiffProPipe, PostCommentCountPipe, PostUpVoteCountPipe, CommonModule, RouterModule]
})
export class PostShowComponent {
  @Input({ transform: numberAttribute }) set postId(postId: number){
    this.dataServices.posts.getById(postId).subscribe(post => {
      this.post = post
    })
  }

  clampText = true

  post?: Post
  dataServices = inject(DataServices)

  unClampText(){
    this.clampText = false
  }
}
