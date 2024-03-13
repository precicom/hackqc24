import { CommonModule } from '@angular/common';
import { Component, OnInit, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { Observable } from 'rxjs';
import { Post } from '../../../repository/posts/classes';
import { PostCardComponent } from "../post-card/post-card.component";
import { RouterModule } from '@angular/router';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import {CdkAccordionModule, CDK_ACCORDION} from '@angular/cdk/accordion';
import { SearchInputComponent } from "../../form-fields/search-input/search-input.component";

interface CategoryVM
  {
    key: string
    categoryName: string
    themeName: string    
    postCount: number
    posts: Post[]
  }
interface ViewModel {
  categories: CategoryVM[]
}

@Component({
    selector: 'app-post-list',
    standalone: true,
    templateUrl: './post-list.component.html',
    styleUrl: './post-list.component.scss',
    imports: [CommonModule, PostCardComponent, RouterModule, MatExpansionModule, CdkAccordionModule, SearchInputComponent]
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

  // groups posts by categories and theme name (aka groupBy on two fields at the same time)
  buildViewModel(posts: Post[]): ViewModel{
    const categories = posts.reduce((acc, post) => {
      let category = acc.find(c => c.categoryName === post.theme.category && c.themeName === post.theme.name)

      if(!category){
        category = {
          key: `${post.theme.category}-${post.theme.name}`,
          categoryName: post.theme.category,
          themeName: post.theme.name,
          postCount: 0,
          posts: []
        }
        acc.push(category)
      }

      category.postCount++
      category.posts.push(post)

      return acc
    }, [] as CategoryVM[])

    return {
      categories: categories
    }
  }
}
