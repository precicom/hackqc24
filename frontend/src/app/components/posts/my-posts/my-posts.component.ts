import { CommonModule, NgOptimizedImage } from '@angular/common'
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core'
import { DataServices } from '../../../repository/dataServices'
import { Observable } from 'rxjs'
import { Post } from '../../../repository/posts/classes'
import { RouterModule } from '@angular/router'
import { CreatePostComponent } from '../create-post/create-post.component'
import { PostUpVoteCountPipe, PostDownVoteCountPipe } from '../pipes/post-up-vote-count.pipe'
import { PostCommentCountPipe } from '../pipes/post-comment-count.pipe'
import { PostCardComponent } from '../post-card/post-card.component'

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
  ],
})
export class MyPostsComponent implements OnInit {
  @ViewChild('textArea', { static: false }) textAreaRef: ElementRef<HTMLTextAreaElement>
  @ViewChild('fileInput', { static: false }) fileInputRef: ElementRef<HTMLInputElement>
  @ViewChild('imagePreview', { static: false }) imagePreviewRef: ElementRef<HTMLImageElement>

  dataServices = inject(DataServices)
  posts?: Post[]
  creatingPost: boolean = false
  posting: boolean = true
  file: File

  posts$: Observable<Post[]> = this.dataServices.posts.getMyPosts()

  ngOnInit(): void {
    this.refreshList()
  }

  ngAfterViewInit(): void {
    this.fileInputRef.nativeElement.addEventListener('change', () => {
      const reader = new FileReader()

      this.file = this.fileInputRef.nativeElement.files.item(0)

      reader.onloadend = () => {
        this.imagePreviewRef.nativeElement.src = reader.result as string
      }

      if (this.file) {
        reader.readAsDataURL(this.file)
      }
    })
  }

  postCreated() {
    this.refreshList()
  }

  refreshList() {
    this.dataServices.posts.getMyPosts().subscribe(posts => {
      this.posts = posts
    })
  }

  clearCommentBox() {
    this.textAreaRef.nativeElement.value = ''
    this.fileInputRef.nativeElement.value = ''
    this.file = null
  }

  submit(fileInput: HTMLInputElement, textArea: HTMLTextAreaElement) {
    const text = textArea.value
    const file = fileInput.files[0]
    const formData = new FormData()

    formData.append('post[content_text]', text)

    if (file) {
      formData.append('post[image]', file, file.name)
    }

    this.creatingPost = true
    this.dataServices.posts.create(formData).subscribe(response => {
      this.clearCommentBox()

      this.dataServices.posts.getMyPosts().subscribe(posts => {
        this.posts = posts
        this.creatingPost = false
      })
    }, error => {
      this.creatingPost = false
    })
  }
}
