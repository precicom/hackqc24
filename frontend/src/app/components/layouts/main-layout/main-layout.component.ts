import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ROUTES } from '../../../helpers/constants';
import { Location } from '@angular/common'
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent { 
  authService = inject(AuthService)
  router = inject(Router)
  location = inject(Location)


  logout(){
    this.authService.logout()

    this.router.navigate([ROUTES.login])
  }

  back(){
    this.location.back()
  }
}