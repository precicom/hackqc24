// import { WebsocketService } from './../../../services/websocket.service'
import { Component, Input, OnInit, inject } from '@angular/core'
import { Comment } from '../../../repository/comments/classes'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { TimeDiffProPipe } from '../../../pipes/time-diff-pro/time-diff-pro.pipe'
import { DataServices } from '../../../repository/dataServices'
import { CommentUpVoteCountPipe } from '../../../pipes/comments-up-vote-count.pipe'
import { CommentDownVoteCountPipe } from '../../../pipes/comments-down-vote-count.pipe'
import { filter } from 'rxjs'
import { ActionCableBroadcaster } from '../../../services/action-cable/action-cable-broadcaster'
import { ActionCableService } from '../../../services/action-cable/action-cable'

@Component({
  selector: 'app-comment-show',
  standalone: true,
  templateUrl: './comment-show.component.html',
  styleUrl: './comment-show.component.scss',
  imports: [CommonModule, NgOptimizedImage, TimeDiffProPipe, CommentUpVoteCountPipe, CommentDownVoteCountPipe],
})
export class CommentShowComponent implements OnInit {
  @Input() comment: Comment

  actionCableService = inject(ActionCableService)

  postBroadCaster: ActionCableBroadcaster
  //websocketService = inject(WebsocketService)

  clampText: boolean = true

  dataServices = inject(DataServices)

  ngOnInit(): void {
    this.postBroadCaster = this.actionCableService.subscribe('CommentChannel', { params: { comment_id: this.comment.id } })

    this.postBroadCaster
      .on('comment_changed')
      .pipe(filter(res => +res['comment_id'] == this.comment.id))
      .subscribe(() => this.refrechComment())
  }

  unClampText() {
    this.clampText = false
  }

  upVote() {
    this.dataServices.comments.upVote(this.comment.id).subscribe(response => {
      this.dataServices.comments.getById(this.comment.id).subscribe(comment => {
        this.comment = comment
      })
    })
  }

  downVote() {
    this.dataServices.comments.downVote(this.comment.id).subscribe(response => {
      this.dataServices.comments.getById(this.comment.id).subscribe(comment => {
        this.comment = comment
      })
    })
  }

  refrechComment() {
    this.dataServices.comments.getById(this.comment.id).subscribe(comment => {
      this.comment = comment
    })
  }
}
