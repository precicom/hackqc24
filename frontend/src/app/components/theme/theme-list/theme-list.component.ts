import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { Observable } from 'rxjs';
import { Theme } from '../../../repository/themes/classes';

@Component({
  selector: 'app-theme-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-list.component.html',
  styleUrl: './theme-list.component.scss'
})
export class ThemeListComponent {
  dataServices = inject(DataServices)

  themes$: Observable<Theme[]> = this.dataServices.themes.getAll() 
}
