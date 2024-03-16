import { Component, inject } from '@angular/core';
import {  RouterModule } from '@angular/router';
import { CouncilLatestInformationComponent } from "../council-latest-information/council-latest-information.component";
import { MostPopularThemesComponent } from "../most-popular-themes/most-popular-themes.component";
import { fadeIn, fadeInDelay, slideAndFadeIn } from '../../../animations/animations';
import { CarousselComponent } from "../../carousel/carousel.component";
import { DataServices } from '../../../repository/dataServices';
import { Observable, delay } from 'rxjs';
import { DiscussionPoint } from '../../../repository/discussion-points/classes';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    animations: [fadeIn, slideAndFadeIn, fadeInDelay],
    imports: [CommonModule, RouterModule, CouncilLatestInformationComponent, MostPopularThemesComponent, CarousselComponent]
})
export class HomeComponent {
  dataServices = inject(DataServices)

  discussionPoints$: Observable<DiscussionPoint[]> = this.dataServices.discussionPoints.getLatestDiscussionPoints().pipe(delay(500))
}
