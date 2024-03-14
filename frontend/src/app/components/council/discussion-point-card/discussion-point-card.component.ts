import { Component, Input } from '@angular/core';
import { DiscussionPoint } from '../../../repository/discussion-points/classes';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-discussion-point-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './discussion-point-card.component.html',
  styleUrl: './discussion-point-card.component.scss'
})
export class DiscussionPointCardComponent {
@Input() point: DiscussionPoint


}
