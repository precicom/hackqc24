import { AfterViewInit, Component, ElementRef, Input, ViewChild, inject, numberAttribute } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { Post } from '../../../repository/posts/classes';
import { TimeDiffProPipe } from "../../../pipes/time-diff-pro/time-diff-pro.pipe";
import { PostCommentCountPipe } from "../pipes/post-comment-count.pipe";
import { PostUpVoteCountPipe } from "../pipes/post-up-vote-count.pipe";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Comment } from '../../../repository/comments/classes';
import { SortByPipe } from '../../../pipes/sort-by/sort-by.pipe';
import { CommentShowComponent } from "../../comments/comment-show/comment-show.component";

@Component({
    selector: 'app-post-show',
    standalone: true,
    templateUrl: './post-show.component.html',
    styleUrl: './post-show.component.scss',
    imports: [TimeDiffProPipe, PostCommentCountPipe, PostUpVoteCountPipe, CommonModule, RouterModule, SortByPipe, CommentShowComponent]
})
export class PostShowComponent implements AfterViewInit {
  @ViewChild('fileInput', { static: false }) fileInputRef: ElementRef<HTMLInputElement>
  @ViewChild('imagePreview', { static: false }) imagePreviewRef: ElementRef<HTMLImageElement>

  @Input({ transform: numberAttribute }) set postId(postId: number){
    this.dataServices.posts.getById(postId).subscribe(post => {
      this.post = post
      this.comments = post.comments
    })
  }

  clampText = true
  file: File

  post?: Post
  comments: Comment[] = []
  dataServices = inject(DataServices)

  ngAfterViewInit(): void {
  

    this.fileInputRef.nativeElement.addEventListener('change', () => {
      const reader = new FileReader();

      this.file = this.fileInputRef.nativeElement.files.item(0)

      reader.onloadend = () => {
        this.imagePreviewRef.nativeElement.src = reader.result as string
      }

      if(this.file){
        reader.readAsDataURL(this.file)
      }
    });
  }

  unClampText(){
    this.clampText = false
  }

  submit(fileInput: HTMLInputElement, textArea: HTMLTextAreaElement){
    const text = textArea.value;
    const file = fileInput.files[0];

    const formData = new FormData();
  
    // Structure the data as Rails expects it, with a 'comment' parent
    formData.append('comment[content_text]', text);
    formData.append('comment[post_id]', this.post.id.toString());

    if(file){
      formData.append('comment[image]', file, file.name);
    }

    this.dataServices.comments.create(formData).subscribe(response => {
      this.dataServices.posts.comments(this.post.id).subscribe(comments => {
        this.comments = comments
      })
    });
  }
}
