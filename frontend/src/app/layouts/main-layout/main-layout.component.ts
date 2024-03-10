import { Component, OnInit, inject } from '@angular/core';
import { Navigation, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ROUTES } from '../../constants';
import { Location } from '@angular/common'

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