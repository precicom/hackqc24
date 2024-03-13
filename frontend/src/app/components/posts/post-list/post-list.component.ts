import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, QueryList, ViewChildren, inject, numberAttribute } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Post } from '../../../repository/posts/classes';
import { PostCardComponent } from "../post-card/post-card.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import {CdkAccordionModule, CDK_ACCORDION} from '@angular/cdk/accordion';
import { SearchInputComponent } from "../../form-fields/search-input/search-input.component";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Theme } from '../../../repository/themes/classes';

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

@UntilDestroy()
@Component({
    selector: 'app-post-list',
    standalone: true,
    templateUrl: './post-list.component.html',
    styleUrl: './post-list.component.scss',
    imports: [CommonModule, PostCardComponent, RouterModule, MatExpansionModule, CdkAccordionModule, SearchInputComponent]
})
export class PostListComponent implements OnInit {
  @ViewChildren('accordion', { read: CDK_ACCORDION }) accordions: QueryList<MatAccordion>
  @Input({ transform: numberAttribute}) set themeId(themeId: number){
    this.activeThemeId$.next(themeId)
  }

  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)
  dataServices = inject(DataServices)
  activeThemeId$ = new BehaviorSubject<number>(null)
  searchValue$ = new BehaviorSubject<string>('')

  posts$: Observable<Post[]>
  activeTheme: Theme

  vm: ViewModel
  themes: Theme[]

  firstRender = true

  onThemeSelect(theme: Theme){
    this.activeThemeId$.next(theme.id)
    this.activeTheme = theme
  }

  removeActiveTheme(){
    this.activeThemeId$.next(null)
    this.activeTheme = null

    this.router.navigate(['.'], {queryParams: {themeId: null}, replaceUrl: false, relativeTo: this.activatedRoute})
  }

  search(value: string){
    this.searchValue$.next(value)
  }

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
    combineLatest([
      this.dataServices.themes.getAll(),
      this.dataServices.posts.getAll(),
      this.searchValue$,
      this.activeThemeId$
    ]).pipe(
      untilDestroyed(this)
    ).subscribe(([themes, posts, searchValue, activeThemeId]) => {   
      let filteredPost = posts

      this.themes = themes

      if(activeThemeId){
        filteredPost = posts.filter(post => post.theme.id === activeThemeId)
        this.activeTheme = themes.find(theme => theme.id === activeThemeId)
      }

      if(searchValue){
        filteredPost = filteredPost.filter(post => {
          return post.content_text.toLowerCase().includes(searchValue.toLowerCase()) || 
            post.theme.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            post.theme.category.toLowerCase().includes(searchValue.toLowerCase())
        })
      }
   
      this.vm = this.buildViewModel(filteredPost)

      if(this.firstRender){
        this.firstRender = false
        setTimeout(() => {
          this.expandAll()
        }, 250)
      }
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
