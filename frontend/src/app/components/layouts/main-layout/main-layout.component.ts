import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ROUTES } from '../../../helpers/constants';
import { CommonModule } from '@angular/common'
import { AuthService } from '../../../auth/auth.service';
import { PageInformation } from '../../../services/page-information';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  authService = inject(AuthService)
  router = inject(Router)
  pageInfoService = inject(PageInformation)

  title: string = ''

  ngOnInit(): void {
    this.pageInfoService.title$.subscribe(title => {
      this.title = title
    })
  }

  logout(){
    this.authService.logout()

    this.router.navigate([ROUTES.login])
  }

  home(){
    this.router.navigate([ROUTES.home])
  }
}