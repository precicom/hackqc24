import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataServices } from '../../../repository/dataServices';
import { Observable } from 'rxjs';
import { Council } from '../../../repository/council/classes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-council-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './council-list.component.html',
  styleUrl: './council-list.component.scss'
})
export class CouncilListComponent {
  dataServices = inject(DataServices)

  councils$: Observable<Council[]> = this.dataServices.councils.getAll() 
}
