import { Component, Input } from '@angular/core';
import { Post } from '../../../repository/posts/classes';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PostUpVoteCountPipe, PostDownVoteCountPipe } from "../pipes/post-up-vote-count.pipe";
import { PostCommentCountPipe } from "../pipes/post-comment-count.pipe";

@Component({
    selector: 'app-post-card',
    standalone: true,
    templateUrl: './post-card.component.html',
    styleUrl: './post-card.component.scss',
    imports: [CommonModule, NgOptimizedImage, PostUpVoteCountPipe, PostDownVoteCountPipe, PostCommentCountPipe]
})
export class PostCardComponent {
  @Input() post: Post;
  @Input() showStatistics = false
  @Input() showTags = false

}
