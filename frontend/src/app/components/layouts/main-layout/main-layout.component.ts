import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ROUTES } from '../../../helpers/constants';
import { CommonModule, Location } from '@angular/common'
import { AuthService } from '../../../auth/auth.service';
import { PageInformation } from '../../../services/page-information';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  authService = inject(AuthService)
  router = inject(Router)
  pageInfoService = inject(PageInformation)

  logout(){
    this.authService.logout()

    this.router.navigate([ROUTES.login])
  }

  home(){
    this.router.navigate([ROUTES.home])
  }
}