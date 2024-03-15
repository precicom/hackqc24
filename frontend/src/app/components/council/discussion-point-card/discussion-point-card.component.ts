import { Component, Input } from '@angular/core';
import { DiscussionPoint } from '../../../repository/discussion-points/classes';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CapitalizePipe } from "../../../pipes/capitalize/capitalize.pipe";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-discussion-point-card',
    standalone: true,
    templateUrl: './discussion-point-card.component.html',
    styleUrl: './discussion-point-card.component.scss',
    imports: [CommonModule, TranslateModule, CapitalizePipe, RouterModule]
})
export class DiscussionPointCardComponent {
@Input() point: DiscussionPoint


}
