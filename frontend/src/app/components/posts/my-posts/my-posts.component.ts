import { CommonModule, NgOptimizedImage } from '@angular/common'
import { Component, OnInit, ViewChild, inject } from '@angular/core'
import { DataServices } from '../../../repository/dataServices'
import { delay } from 'rxjs'
import { Post } from '../../../repository/posts/classes'
import { RouterModule } from '@angular/router'
import { PostUpVoteCountPipe, PostDownVoteCountPipe } from '../pipes/post-up-vote-count.pipe'
import { PostCommentCountPipe } from '../pipes/post-comment-count.pipe'
import { PostCardComponent } from '../post-card/post-card.component'
import { MessageFormComponent, MessageSubmitEvent } from "../message-form/message-form.component";
import { fadeIn, slideAndFadeIn, staggeredFadeIn } from '../../../animations/animations'

@Component({
    selector: 'app-my-posts',
    standalone: true,
    templateUrl: './my-posts.component.html',
    styleUrl: './my-posts.component.scss',
    animations: [slideAndFadeIn, fadeIn, staggeredFadeIn],
    imports: [
        CommonModule,
        RouterModule,
        PostUpVoteCountPipe,
        PostCommentCountPipe,
        PostDownVoteCountPipe,
        NgOptimizedImage,
        PostCardComponent,
        MessageFormComponent
    ]
})
export class MyPostsComponent implements OnInit {
  @ViewChild(MessageFormComponent, { static: false }) messageForm: MessageFormComponent

  dataServices = inject(DataServices)
  posts?: Post[]
  creatingPost: boolean = false 

  ngOnInit(): void {
    this.refreshList()
  } 

  postCreated() {
    this.refreshList()
  }

  refreshList() {
    // Added delay so user can see loader... looks more professional
    this.dataServices.posts.getMyPosts().pipe(delay(500)).subscribe(posts => {
      this.posts = posts
    })
  }

  submit(event: MessageSubmitEvent) {
    const formData = new FormData()

    formData.append('post[content_text]', event.text)

    if (event.file) {
      formData.append('post[image]', event.file, event.file.name)
    }

    this.creatingPost = true
    this.dataServices.posts.create(formData).subscribe(response => {
      this.messageForm.clearCommentBox()

      this.dataServices.posts.getMyPosts().subscribe(posts => {
        this.posts = posts
        this.creatingPost = false
      })
    }, error => {
      this.creatingPost = false
    })
  }
}
