import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../../../repository/posts/classes';

@Pipe({
  name: 'postUpVoteCount',
  standalone: true
})
export class PostUpVoteCountPipe implements PipeTransform {
  transform(post: Post): number {
    return post.user_votes?.length ?? 0;
  }
}
