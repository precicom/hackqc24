import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { Observable } from 'rxjs';
import { Post } from '../../../repository/posts/classes';
import { RouterModule } from '@angular/router';
import { CreatePostComponent } from '../create-post/create-post.component';
import { PostUpVoteCountPipe, PostDownVoteCountPipe } from '../pipes/post-up-vote-count.pipe';
import { PostCommentCountPipe } from '../pipes/post-comment-count.pipe';

@Component({
    selector: 'app-my-posts',
    standalone: true,
    templateUrl: './my-posts.component.html',
    styleUrl: './my-posts.component.scss',
    imports: [CommonModule, RouterModule, CreatePostComponent, PostUpVoteCountPipe, PostCommentCountPipe, PostDownVoteCountPipe]
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

  postCreated(){
    this.refreshList()
  }

  refreshList(){
    this.dataServices.posts.getMyPosts().subscribe(posts => {
      this.posts = posts
    })
  }

  submit(fileInput, textArea){

  }
}
