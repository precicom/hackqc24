import { Pipe, PipeTransform } from '@angular/core';
import { Comment } from '../../../repository/comments/classes';

@Pipe({
  name: 'commentDownVoteCount',
  standalone: true
})
export class CommentDownVoteCountPipe implements PipeTransform {
  transform(comment: Comment): number {
    return comment.user_votes?.filter(vote => vote.is_downvote)?.length ?? 0
  }
}
