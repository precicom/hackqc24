import { Pipe, PipeTransform } from '@angular/core'
import { Post } from '../../../repository/posts/classes'

@Pipe({
  name: 'postCommentCount',
  standalone: true,
})
export class PostCommentCountPipe implements PipeTransform {
  transform(post: Post): number {
    return post.comments?.filter(comment => comment.status == 'accepted').length ?? 0
  }
}
