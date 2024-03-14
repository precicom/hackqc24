import { Component, inject } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { Observable, delay } from 'rxjs';
import { Theme } from '../../../repository/themes/classes';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { fadeIn, fadeOut, slideInOut, staggeredFadeIn } from '../../../animations/animations';

@Component({
  selector: 'app-most-popular-themes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './most-popular-themes.component.html',
  styleUrl: './most-popular-themes.component.scss',
  animations:[fadeIn, slideInOut, staggeredFadeIn, fadeOut]
})
export class MostPopularThemesComponent {
  dataServices = inject(DataServices)

  themes$: Observable<Theme[]> = this.dataServices.themes.popularThemes().pipe(delay(500))
}
