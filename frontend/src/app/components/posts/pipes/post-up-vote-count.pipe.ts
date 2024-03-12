import { Pipe, PipeTransform, inject } from '@angular/core';
import { Post } from '../../../repository/posts/classes';
import { AuthService } from '../../../auth/auth.service';

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

@Pipe({
  name: 'currentUserUpVoted',
  standalone: true
})
export class CurrentUserUpVotedPipe implements PipeTransform {
  authService = inject(AuthService)

  transform(post: Post): boolean {
    return post.user_votes?.some(vote => vote.user_id === this.authService.currentUserId && !vote.is_downvote) ?? false
  }
}

