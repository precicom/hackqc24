import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NguCarousel, NguCarouselConfig, NguTileComponent, NguCarouselDefDirective, NguCarouselNextDirective, NguCarouselPrevDirective, NguItemComponent, NguCarouselPointDirective } from '@ngu/carousel';
import { DiscussionPoint } from '../../repository/discussion-points/classes';
import { RouterModule } from '@angular/router';
import { fadeIn } from '../../animations/animations';

@Component({
  selector: 'app-carousel',
  imports: [
    CommonModule,
    NguCarousel,
    NguTileComponent,
    NguCarousel,
    NguCarouselDefDirective,
    NguCarouselPointDirective,
    NguCarouselNextDirective,
    NguCarouselPrevDirective,
    NguItemComponent,
    RouterModule,
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  standalone: true
})
export class CarousselComponent  {
  @Input({transform: (value: any[]) => value ?? [] }) points: DiscussionPoint[]

  public carouselTile: NguCarouselConfig = {
    grid: {xs: 1, sm: 2, md: 3, lg: 5, xl:5, all: 0},
    gridBreakpoints: { sm: 450, md: 600, lg: 1200, xl: 1200 },
    slide: 2,
    speed: 400,
    animation: 'lazy',
    interval: { timing: 4000 },
    loop: true,
    point: {
      visible: true
    },
    load: 2,
    touch: true,
    easing: 'ease'
  } 
}