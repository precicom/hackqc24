import { Component, Input } from '@angular/core'
import { Post } from '../../../repository/posts/classes'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { PostUpVoteCountPipe, PostDownVoteCountPipe } from '../pipes/post-up-vote-count.pipe'
import { PostCommentCountPipe } from '../pipes/post-comment-count.pipe'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'app-post-card',
  standalone: true,
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
  imports: [CommonModule, NgOptimizedImage, PostUpVoteCountPipe, PostDownVoteCountPipe, PostCommentCountPipe, TranslateModule],
})
export class PostCardComponent {
  @Input() post: Post
  @Input() showStatistics = false
  @Input() showTags = false
  @Input() showTagsBellow = false
  @Input() showIcon= false
}
