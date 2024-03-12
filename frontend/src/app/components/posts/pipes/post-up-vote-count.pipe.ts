import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../../../repository/posts/classes';

@Pipe({
  name: 'postUpVoteCount',
  standalone: true
})
export class PostUpVoteCountPipe implements PipeTransform {
  transform(post: Post): number {
    return post.user_votes?.filter(vote => !vote.is_downvote)?.length ?? 0
  }
}

@Pipe({
  name: 'postDownVoteCount',
  standalone: true
})
export class PostDownVoteCountPipe implements PipeTransform {
  transform(post: Post): number {
    return post.user_votes?.filter(vote => vote.is_downvote)?.length ?? 0
  }
}
