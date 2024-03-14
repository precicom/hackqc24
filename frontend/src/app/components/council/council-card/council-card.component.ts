import { Component, Input } from '@angular/core';
import { Council } from '../../../repository/council/classes';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CapitalizePipe } from '../../../pipes/capitalize/capitalize.pipe';

@Component({
  selector: 'app-council-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CapitalizePipe],
  templateUrl: './council-card.component.html',
  styleUrl: './council-card.component.scss'
})
export class CouncilCardComponent {
  @Input() council: Council
}
