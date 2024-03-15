import { Component, Input } from '@angular/core';
import { DiscussionPoint } from '../../../../repository/discussion-points/classes';

@Component({
  selector: 'app-dicussion-point-card',
  standalone: true,
  imports: [],
  templateUrl: './dicussion-point-card.component.html',
  styleUrl: './dicussion-point-card.component.scss'
})
export class DicussionPointCardComponent {
  @Input() point: DiscussionPoint

}
