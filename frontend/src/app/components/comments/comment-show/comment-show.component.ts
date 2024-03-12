import { Component, Input, inject } from '@angular/core';
import { Comment } from '../../../repository/comments/classes';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TimeDiffProPipe } from "../../../pipes/time-diff-pro/time-diff-pro.pipe";
import { DataServices } from '../../../repository/dataServices';
import { CommentUpVoteCountPipe } from '../pipes/comments-up-vote-count.pipe';
import { CommentDownVoteCountPipe } from '../pipes/comments-down-vote-count.pipe';

@Component({
    selector: 'app-comment-show',
    standalone: true,
    templateUrl: './comment-show.component.html',
    styleUrl: './comment-show.component.scss',
    imports: [CommonModule, NgOptimizedImage, TimeDiffProPipe, CommentUpVoteCountPipe, CommentDownVoteCountPipe]
})
export class CommentShowComponent {
  @Input() comment: Comment

  dataServices = inject(DataServices)

  upVote(){
    this.dataServices.comments.upVote(this.comment.id).subscribe(response => {
      this.dataServices.comments.getById(this.comment.id).subscribe(comment => {
        this.comment = comment
      })
    })
  }

  downVote(){
    this.dataServices.comments.downVote(this.comment.id).subscribe(response => {
      this.dataServices.comments.getById(this.comment.id).subscribe(comment => {
        this.comment = comment
      })
    })
  }
}
