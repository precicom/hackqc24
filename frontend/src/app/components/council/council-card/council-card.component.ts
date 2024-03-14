import { Component, Input } from '@angular/core';
import { Council } from '../../../repository/council/classes';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-council-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './council-card.component.html',
  styleUrl: './council-card.component.scss'
})
export class CouncilCardComponent {
  @Input() council: Council
}
