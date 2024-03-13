import { CommonModule } from '@angular/common';
import { Component, OnInit, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { Observable } from 'rxjs';
import { Post } from '../../../repository/posts/classes';
import { PostCardComponent } from "../post-card/post-card.component";
import { RouterModule } from '@angular/router';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import {CdkAccordionModule, CDK_ACCORDION} from '@angular/cdk/accordion';

interface ThemeVM {
  postCount: number
  name: string
  posts: Post[]
}
interface CategoryVM
  {
    name: string
    postCount: number
    themes: ThemeVM[]
  }
interface ViewModel {
  categories: CategoryVM[]
}

@Component({
    selector: 'app-post-list',
    standalone: true,
    templateUrl: './post-list.component.html',
    styleUrl: './post-list.component.scss',
    imports: [CommonModule, PostCardComponent, RouterModule, MatExpansionModule, CdkAccordionModule ]
})
export class PostListComponent implements OnInit{
  @ViewChildren('accordion', { read: CDK_ACCORDION }) accordions: QueryList<MatAccordion>
  dataServices = inject(DataServices)

  posts$: Observable<Post[]>

  vm: ViewModel

  expandAll(){
    this.accordions.forEach(accordion => {
      accordion.openAll()
    
    }) 
  }

  collapseAll(){
    this.accordions.forEach(accordion => {
      accordion.closeAll()
    })
  }

  ngOnInit(): void {
    this.dataServices.posts.getAll().subscribe(posts => {
      this.vm = this.buildViewModel(posts)
    })
  }

  // groups posts by categories and then by theme name
  buildViewModel(posts: Post[]): ViewModel{
    const categories: CategoryVM[] = posts.reduce((acc, post) => {
      const category: CategoryVM = acc.find(c => c.name === post.theme.category)

      if (category) {
        const theme: ThemeVM = category.themes.find(t => t.name === post.theme.name)
        if (theme) {
          category.postCount ++
          theme.postCount ++
          
          theme.posts.push(post)
        } else {
          category.themes.push({ name: post.theme.name, postCount: 1, posts: [post] })
        }
      } else {
        acc.push({ name: post.theme.category, postCount: 1, themes: [{ name: post.theme.name, postCount: 1 ,posts: [post] }] })
      }
      return acc
    }, [])
  

    return { categories }
  }
}
