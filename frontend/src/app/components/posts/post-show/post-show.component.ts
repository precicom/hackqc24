import { Component, Input, inject, numberAttribute } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { Post } from '../../../repository/posts/classes';
import { TimeDiffProPipe } from "../../../pipes/time-diff-pro/time-diff-pro.pipe";
import { PostCommentCountPipe } from "../pipes/post-comment-count.pipe";
import { PostUpVoteCountPipe } from "../pipes/post-up-vote-count.pipe";

@Component({
    selector: 'app-post-show',
    standalone: true,
    templateUrl: './post-show.component.html',
    styleUrl: './post-show.component.scss',
    imports: [TimeDiffProPipe, PostCommentCountPipe, PostUpVoteCountPipe]
})
export class PostShowComponent {
  @Input({ transform: numberAttribute }) set postId(postId: number){
    this.dataServices.posts.getById(postId).subscribe(post => {
      this.post = post
    })
  }

  post?: Post
  dataServices = inject(DataServices)
}
