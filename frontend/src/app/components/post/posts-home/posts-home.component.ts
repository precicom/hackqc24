import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-posts-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './posts-home.component.html',
  styleUrl: './posts-home.component.scss'
})
export class PostsHomeComponent {

}
