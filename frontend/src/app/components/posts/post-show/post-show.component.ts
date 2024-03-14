import { WebsocketService } from './../../../services/websocket.service'
import { Component, Input, OnInit, ViewChild, inject, numberAttribute } from '@angular/core'
import { DataServices } from '../../../repository/dataServices'
import { Post } from '../../../repository/posts/classes'
import { TimeDiffProPipe } from '../../../pipes/time-diff-pro/time-diff-pro.pipe'
import { PostCommentCountPipe } from '../pipes/post-comment-count.pipe'
import { CurrentUserUpVotedPipe, PostDownVoteCountPipe, PostUpVoteCountPipe } from '../pipes/post-up-vote-count.pipe'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { RouterModule } from '@angular/router'
import { Comment } from '../../../repository/comments/classes'
import { SortByPipe } from '../../../pipes/sort-by/sort-by.pipe'
import { CommentShowComponent } from '../../comments/comment-show/comment-show.component'
import { ImagePreviewDirective } from '../../../directives/image-preview.directive'
import { delay, filter } from 'rxjs'
import { MessageFormComponent, MessageSubmitEvent } from "../message-form/message-form.component";
import { fadeIn, slideAndFadeIn, staggeredFadeIn } from '../../../animations/animations'

@Component({
    selector: 'app-post-show',
    standalone: true,
    templateUrl: './post-show.component.html',
    styleUrl: './post-show.component.scss',
    animations: [slideAndFadeIn, fadeIn, staggeredFadeIn],
    imports: [
        TimeDiffProPipe,
        PostCommentCountPipe,
        PostUpVoteCountPipe,
        CommonModule,
        RouterModule,
        SortByPipe,
        CommentShowComponent,
        PostDownVoteCountPipe,
        CurrentUserUpVotedPipe,
        NgOptimizedImage,
        ImagePreviewDirective,
        MessageFormComponent
    ]
})
export class PostShowComponent implements OnInit {
  @ViewChild(MessageFormComponent, { static: false }) messageForm: MessageFormComponent

  private _postId: number
  @Input({ transform: numberAttribute }) set postId(postId: number) {
    this.dataServices.posts.getById(postId).pipe(delay(500)).subscribe(post => {
      this._postId = postId
      this.post = post
      this.comments = post.comments
    })
  }

  get postId() {
    return this._postId
  }

  websocketService = inject(WebsocketService)

  clampText = true
  commenting: boolean = false
  creatingComment: boolean = false
  showComments: boolean = true

  post?: Post
  comments: Comment[] = []
  dataServices = inject(DataServices)

  ngOnInit(): void {
    this.websocketService.getRefreshPost()
    this.websocketService.getRefreshAllComments()

    this.websocketService.refreshPostId$.pipe(filter(id => !!id && +id == this.postId)).subscribe(() => this.refreshPost())
    this.websocketService.refreshAllComments$.pipe(filter(id => !!id && +id == this.postId)).subscribe(() => this.refrechComments())
  }

  unClampText() {
    this.clampText = false
  }

  toggleComments() {
    this.showComments = true

    this.fetchComments()
  }

  toggleCommentBox() {
    this.commenting = !this.commenting

    if (this.commenting) {
      setTimeout(() => {
        this.messageForm.textAreaRef.nativeElement.focus()
      }, 50)
    }
  }

  fetchComments() {
    this.dataServices.posts.comments(this.post.id).subscribe(comments => {
      this.comments = comments
    })
  }

  upVote() {
    this.dataServices.posts.upVote(this.post.id).subscribe(() => {
      this.refreshPost()
    })
  }

  downVote() {
    this.dataServices.posts.downVote(this.post.id).subscribe(() => {
      this.refreshPost()
    })
  }

  refreshPost() {
    this.dataServices.posts.getById(this.post.id).subscribe(post => {
      this.post = post
    })
  } 

  submit(event: MessageSubmitEvent) {
    const formData = new FormData()

    formData.append('comment[content_text]', event.text)
    formData.append('comment[post_id]', this.post.id.toString())

    if (event.file) {
      formData.append('comment[image]', event.file, event.file.name)
    }

    this.creatingComment = true
    this.dataServices.comments.create(formData).subscribe(response => {
      this.messageForm.clearCommentBox()
      this.websocketService.sendRefreshAllComments(this.postId)
      this.refrechComments()
    })
  }

  refrechComments() {
    this.dataServices.posts.comments(this.post.id).subscribe(comments => {
      this.comments = comments
      this.creatingComment = false
    })
  }
}
