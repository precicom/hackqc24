import { Component } from '@angular/core';
import {  RouterModule } from '@angular/router';
import { CouncilLatestInformationComponent } from "../council-latest-information/council-latest-information.component";
import { MostPopularThemesComponent } from "../most-popular-themes/most-popular-themes.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [RouterModule, CouncilLatestInformationComponent, MostPopularThemesComponent]
})
export class HomeComponent {
 
}
