import { Component, ElementRef, Input, ViewChild, inject, numberAttribute } from '@angular/core'
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

@Component({
  selector: 'app-post-show',
  standalone: true,
  templateUrl: './post-show.component.html',
  styleUrl: './post-show.component.scss',
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
    ImagePreviewDirective
  ],
})
export class PostShowComponent {
  @ViewChild('textArea', { static: false }) textAreaRef: ElementRef<HTMLTextAreaElement>
  @ViewChild('fileInput', { static: false }) fileInputRef: ElementRef<HTMLInputElement>
  @ViewChild('imagePreview', { static: false }) imagePreviewRef: ElementRef<HTMLImageElement>

  @Input({ transform: numberAttribute }) set postId(postId: number) {
    this.dataServices.posts.getById(postId).subscribe(post => {
      this.post = post
      this.comments = post.comments
    })
  }

  clampText = true
  file: File
  commenting: boolean = false
  creatingComment: boolean = false
  showComments: boolean = false

  post?: Post
  comments: Comment[] = []
  dataServices = inject(DataServices)

  unClampText() {
    this.clampText = false
  }

  toggleComments() {
    this.showComments = true

    this.fetchComments()
  }

  toggleCommentBox() { 
    this.commenting = !this.commenting

    if(this.commenting){
      setTimeout(() => {
        this.textAreaRef.nativeElement.focus()
      }, 0)
    }
  }

  fetchComments(){    
    this.dataServices.posts.comments(this.post.id).subscribe(comments => {
      this.comments = comments     
    })
  }

  upVote(){
    this.dataServices.posts.upVote(this.post.id).subscribe(() => {
      this.refreshPost()
    })
  }

  downVote(){
    this.dataServices.posts.downVote(this.post.id).subscribe(() => {
      this.refreshPost()
    })
  }

  setFile(file: File){
    this.file = file
  }

  refreshPost(){
    this.dataServices.posts.getById(this.post.id).subscribe(post => {
      this.post = post
    })
  }

  clearCommentBox(){
    this.textAreaRef.nativeElement.value = ''
    this.fileInputRef.nativeElement.value = ''
    this.file = null
  }

  submit(fileInput: HTMLInputElement, textArea: HTMLTextAreaElement) {
    const text = textArea.value
    const file = fileInput.files[0]
    const formData = new FormData()

    formData.append('comment[content_text]', text)
    formData.append('comment[post_id]', this.post.id.toString())

    if (file) {
      formData.append('comment[image]', file, file.name)
    }

    this.creatingComment = true
    this.dataServices.comments.create(formData).subscribe(response => {
      this.clearCommentBox()

      this.dataServices.posts.comments(this.post.id).subscribe(comments => {
        this.comments = comments
        this.creatingComment = false
      })
    })
  }  
}
