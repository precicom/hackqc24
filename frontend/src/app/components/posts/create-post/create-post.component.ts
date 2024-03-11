import { Component, inject } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  dataServices = inject(DataServices)

  submit(text: string){
    this.dataServices.posts.create({ content_text: text })
  }
}
