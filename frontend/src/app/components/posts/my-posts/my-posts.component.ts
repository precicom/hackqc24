import { CommonModule, NgOptimizedImage } from '@angular/common'
import { Component, OnInit, ViewChild, inject } from '@angular/core'
import { DataServices } from '../../../repository/dataServices'
import { Observable } from 'rxjs'
import { Post } from '../../../repository/posts/classes'
import { RouterModule } from '@angular/router'
import { CreatePostComponent } from '../create-post/create-post.component'
import { PostUpVoteCountPipe, PostDownVoteCountPipe } from '../pipes/post-up-vote-count.pipe'
import { PostCommentCountPipe } from '../pipes/post-comment-count.pipe'
import { PostCardComponent } from '../post-card/post-card.component'
import { MessageFormComponent, MessageSubmitEvent } from "../message-form/message-form.component";

@Component({
    selector: 'app-my-posts',
    standalone: true,
    templateUrl: './my-posts.component.html',
    styleUrl: './my-posts.component.scss',
    imports: [
        CommonModule,
        RouterModule,
        CreatePostComponent,
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

  posts$: Observable<Post[]> = this.dataServices.posts.getMyPosts()

  ngOnInit(): void {
    this.refreshList()
  } 

  postCreated() {
    this.refreshList()
  }

  refreshList() {
    this.dataServices.posts.getMyPosts().subscribe(posts => {
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
