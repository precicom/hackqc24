import { Component, inject } from '@angular/core'
import { Observable, delay } from 'rxjs'
import { DiscussionPoint } from '../../../repository/discussion-points/classes'
import { DataServices } from '../../../repository/dataServices'
import { CommonModule } from '@angular/common'
import { fadeIn, fadeOut, slideInOut, staggeredFadeIn } from '../../../animations/animations'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-council-latest-information',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './council-latest-information.component.html',
  styleUrl: './council-latest-information.component.scss',
  animations: [fadeIn, slideInOut, staggeredFadeIn, fadeOut],
})
export class CouncilLatestInformationComponent {
  dataServices = inject(DataServices)

  discussionPoints$: Observable<DiscussionPoint[]> = this.dataServices.discussionPoints.getLatestDiscussionPoints()
}
