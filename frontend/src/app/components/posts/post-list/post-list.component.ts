import { CommonModule } from '@angular/common'
import { Component, Input, OnInit, QueryList, ViewChildren, inject, numberAttribute } from '@angular/core'
import { DataServices } from '../../../repository/dataServices'
import { BehaviorSubject, Observable, ReplaySubject, Subject, combineLatest, delay } from 'rxjs'
import { Post } from '../../../repository/posts/classes'
import { PostCardComponent } from '../post-card/post-card.component'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion'
import { CdkAccordionModule, CDK_ACCORDION } from '@angular/cdk/accordion'
import { SearchInputComponent } from '../../form-fields/search-input/search-input.component'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Theme } from '../../../repository/themes/classes'
import { ThemeFilterComponent } from '../../theme/theme-filter/theme-filter.component'
import { fadeIn, slideAndFadeIn, staggeredFadeIn } from '../../../animations/animations'
import { TranslateModule } from '@ngx-translate/core'
import { CapitalizePipe } from '../../../pipes/capitalize/capitalize.pipe'
import { DiscussionPoint } from '../../../repository/discussion-points/classes'
import { DicussionPointCardComponent } from "./dicussion-point-card/dicussion-point-card.component";

interface ListItem {
  id: number
  type: 'post' | 'point',
  post?: Post
  point?: DiscussionPoint
  theme: Theme
}

interface CategoryVM {
  key: string
  categoryName: string
  themeName: string
  postCount: number
  items: ListItem[]
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
    animations: [slideAndFadeIn, fadeIn, staggeredFadeIn],
    imports: [
        CommonModule,
        PostCardComponent,
        RouterModule,
        MatExpansionModule,
        CdkAccordionModule,
        SearchInputComponent,
        ThemeFilterComponent,
        TranslateModule,
        CapitalizePipe,
        DicussionPointCardComponent
    ]
})
export class PostListComponent implements OnInit {
  @ViewChildren('accordion', { read: CDK_ACCORDION }) accordions: QueryList<MatAccordion>
  @Input({ transform: numberAttribute }) set themeId(themeId: number) {
    this.activeThemeId$.next(themeId)
  }

  
  vm: ViewModel

  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)
  dataServices = inject(DataServices)
  activeThemeId$ = new BehaviorSubject<number>(null)
  searchValue$ = new BehaviorSubject<string>('')

  discussionPoints$ = new ReplaySubject<DiscussionPoint[]>(1)
  posts$ = new ReplaySubject<Post[]>(1)
  themes$ = new ReplaySubject<Theme[]>(1)
  selectedThemes$ = new BehaviorSubject<Theme[]>([])

  firstRender = true

  get selectedThemes() {
    return this.selectedThemes$.value
  }

  get selectedThemeIds() {
    return this.selectedThemes.map(theme => theme.id)
  }

  setSelectedThemes(themes: Theme[]) {
    this.selectedThemes$.next(themes ?? [])
  }

  setSearch(value: string) {
    this.searchValue$.next(value)
  }

  expandAll() {
    this.accordions.forEach(accordion => {
      accordion.openAll()
    })
  }

  collapseAll() {
    this.accordions.forEach(accordion => {
      accordion.closeAll()
    })
  }

  ngOnInit(): void {
    this.dataServices.themes.getAll().subscribe(themes => {
      this.themes$.next(themes)
    })

    this.dataServices.posts.getAll().pipe(delay(250)).subscribe(posts => {
      this.posts$.next(posts)
    })

    this.dataServices.discussionPoints.getAll().pipe(delay(250)).subscribe(discussionPoints => {
      this.discussionPoints$.next(discussionPoints)
    })

    combineLatest([this.activeThemeId$, this.themes$])
      .pipe(untilDestroyed(this))
      .subscribe(([activeThemeId, themes]) => {
        if (activeThemeId) {
          this.setSelectedThemes([themes.find(theme => theme.id === activeThemeId)])
        } else {
          this.setSelectedThemes([])
        }
      })

    combineLatest([this.posts$, this.discussionPoints$, this.searchValue$, this.selectedThemes$])
      .pipe(untilDestroyed(this))
      .subscribe(([posts, discussionPoints, searchValue, selectedThemes]) => {
        const filteredPost = this.filterPosts(posts, searchValue, selectedThemes)
        const filteredPoints = this.filterPoints(discussionPoints, searchValue, selectedThemes)        

        this.vm = this.buildViewModel(filteredPost, filteredPoints)

        if (this.firstRender) {
          this.firstRender = false
          setTimeout(() => {
            this.expandAll()
          }, 250)
        }
      })
  }

  filterPoints(points: DiscussionPoint[], search: string, themes: Theme[]): DiscussionPoint[] {
    let filteredPoints = points
    
    if (search) {
      filteredPoints = filteredPoints.filter(post => {
        const text = `${post.generated_summary} ${post.theme.name} ${post.theme.category}`

        return text.toLowerCase().includes(search.toLowerCase())
      })
    }

    // filter by user selected themes
    if (themes.length) {
      const selectedThemeIds = themes.map(theme => theme.id)

      filteredPoints = filteredPoints.filter(point => {
        return selectedThemeIds.some(selectedThemeId => selectedThemeId === point.theme_id)
      })
    }

    return filteredPoints
  }

  filterPosts(posts: Post[], search: string, themes: Theme[]): Post[]{
    let filteredPosts = posts
    
    if (search) {
      filteredPosts = filteredPosts.filter(post => {
        const text = `${post.content_text} ${post.theme.name} ${post.theme.category}`

        return text.toLowerCase().includes(search.toLowerCase())
      })
    }

    // filter by user selected themes
    if (themes.length) {
      const selectedThemeIds = themes.map(theme => theme.id)

      filteredPosts = filteredPosts.filter(post => {
        return selectedThemeIds.some(selectedThemeId => selectedThemeId === post.theme_id)
      })
    }

    return filteredPosts
  }

  // groups posts and points by theme
  buildViewModel(posts: Post[], points: DiscussionPoint[]): ViewModel {
    const postItem: ListItem[] = posts.map(post => { return { id: post.id, type:'post', post: post, theme: post.theme } })
    const pointItem: ListItem[] = points.map(point => { return {id: point.id, type:'point', point: point, theme: point.theme } })

    // aggregate posts and points into one array
    const listItems = [...postItem, ...pointItem]

    // Group post and points into themes
    const categories = listItems.reduce((acc, item) => {
      let category = acc.find(c => c.categoryName === item.theme.category && c.themeName === item.theme.name)

      if (!category) {
        const theme = item.theme

        category = {
          key: `${theme.category}-${theme.name}`,
          categoryName: theme.category,
          themeName: theme.name,
          postCount: 0,
          items: [],
        }
        acc.push(category)
      }

      category.postCount++

      // sorts points before posts
      if(item.type === 'point'){
        category.items.unshift(item)
      }else {
        category.items.push(item)
      }

      return acc
    }, [] as CategoryVM[])

    return {
      categories: categories,
    }
  }
}
