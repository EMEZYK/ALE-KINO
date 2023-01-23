import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthLoginStateService } from './auth-login.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthLoginStateService) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (
      localStorage.getItem('token') !== null &&
      this.auth.auth$ &&
      localStorage.getItem('role') === route.data.role
    ) {
      return true;
    } else {
      this.auth.logout();
      this.router.navigate(['login']);
      return false;
    }
  }
}
