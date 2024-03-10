import { Component, inject } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { Observable } from 'rxjs';
import { Theme } from '../../../repository/themes/classes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-most-popular-themes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './most-popular-themes.component.html',
  styleUrl: './most-popular-themes.component.scss'
})
export class MostPopularThemesComponent {
  dataServices = inject(DataServices)

  themes$: Observable<Theme[]> = this.dataServices.themes.popularThemes() 
}
