import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DiscussionPoint } from '../../../repository/discussion-points/classes';
import { DataServices } from '../../../repository/dataServices';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-council-latest-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './council-latest-information.component.html',
  styleUrl: './council-latest-information.component.scss'
})
export class CouncilLatestInformationComponent {
  dataServices = inject(DataServices)

  discussionPoints$: Observable<DiscussionPoint[]> = this.dataServices.discussionPoints.getLatestDiscussionPoints() 
}
