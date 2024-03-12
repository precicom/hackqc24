import { Component, Input } from '@angular/core';
import { Comment } from '../../../repository/comments/classes';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TimeDiffProPipe } from "../../../pipes/time-diff-pro/time-diff-pro.pipe";

@Component({
    selector: 'app-comment-show',
    standalone: true,
    templateUrl: './comment-show.component.html',
    styleUrl: './comment-show.component.scss',
    imports: [CommonModule, NgOptimizedImage, TimeDiffProPipe]
})
export class CommentShowComponent {
  @Input() comment: Comment


  like(){
    
  }
}
