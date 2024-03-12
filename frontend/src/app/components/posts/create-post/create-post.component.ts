import { Component, EventEmitter, Output, inject } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { Post } from '../../../repository/posts/classes';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  @Output() postCreated = new EventEmitter<Post>()
  dataServices = inject(DataServices)

  submit(text: string){
    // this.dataServices.posts.create({ content_text: text }).subscribe(post => {
    //   this.postCreated.emit(post)
    // })
  }
}
