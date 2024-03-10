import { Component, Input, OnInit, inject, numberAttribute } from '@angular/core';
import { DataServices } from '../../../repository/dataServices';
import { Subject } from 'rxjs';
import { Council } from '../../../repository/council/classes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-council-fiche',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './council-fiche.component.html',
  styleUrl: './council-fiche.component.scss'
})
export class CouncilFicheComponent implements OnInit {
  @Input({transform: numberAttribute}) councilId?: number;

  dataServices = inject(DataServices)

  council$ = new Subject<Council>()

  ngOnInit(): void {
    if(typeof this.councilId === 'number'){
      this.fetchCouncil(this.councilId)
    }
  }

  fetchCouncil(councilId: number){
    this.dataServices.councils.getById(councilId).subscribe(council => {
      this.council$.next(council)
    })
  }
}
