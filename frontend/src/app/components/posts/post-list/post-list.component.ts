import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, QueryList, ViewChildren, inject, numberAttribute } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { BehaviorSubject, Observable, Subject, combineLatest, delay } from 'rxjs';
import { Post } from '../../../repository/posts/classes';
import { PostCardComponent } from "../post-card/post-card.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import {CdkAccordionModule, CDK_ACCORDION} from '@angular/cdk/accordion';
import { SearchInputComponent } from "../../form-fields/search-input/search-input.component";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Theme } from '../../../repository/themes/classes';
import { ThemeFilterComponent } from "../../theme/theme-filter/theme-filter.component";
import { fadeIn, slideAndFadeIn, staggeredFadeIn } from '../../../animations/animations';

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
    imports: [CommonModule, PostCardComponent, RouterModule, MatExpansionModule, CdkAccordionModule, SearchInputComponent, ThemeFilterComponent],
    animations: [slideAndFadeIn, fadeIn, staggeredFadeIn]
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

  vm: ViewModel

  themes$= new Subject<Theme[]>()
  selectedThemes$ = new BehaviorSubject<Theme[]>([])

  firstRender = true

  get selectedThemes(){
    return this.selectedThemes$.value
  }

  get selectedThemeIds(){
    return this.selectedThemes.map(theme => theme.id)  
  }

  setSelectedThemes(themes: Theme[]){   
    this.selectedThemes$.next(themes ?? [])
  }

  setSearch(value: string){
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
    this.dataServices.themes.getAll().subscribe(themes => {
      this.themes$.next(themes)
    })

    combineLatest([
      this.activeThemeId$,
      this.themes$
    ]).pipe(untilDestroyed(this)).subscribe(([activeThemeId, themes]) => {
      if(activeThemeId){
        this.setSelectedThemes([themes.find(theme => theme.id === activeThemeId)])
      }else {
        this.setSelectedThemes([])
      }
    })

    combineLatest([
      this.dataServices.posts.getAll().pipe(delay(250)),
      this.searchValue$,
      this.selectedThemes$
    ]).pipe(
      untilDestroyed(this)
    ).subscribe(([posts, searchValue, selectedThemes]) => {   
      let filteredPost = posts       

      if(searchValue){
        filteredPost = filteredPost.filter(post => {
          const text = `${post.content_text} ${post.theme.name} ${post.theme.category}`

          return text.toLowerCase().includes(searchValue.toLowerCase())
        })
      }

      // filter by user selected themes
      if(selectedThemes.length){
        const selectedThemeIds = selectedThemes.map(theme => theme.id)

        filteredPost = filteredPost.filter(post => {
          return selectedThemeIds.some(selectedThemeId =>selectedThemeId === post.theme_id)
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
