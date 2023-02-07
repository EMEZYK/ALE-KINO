import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthLoginStateService } from './auth-login.service';
import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/local-storage';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private auth = inject(AuthLoginStateService);
  private localStorageService = inject(LocalStorageService);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (
      this.localStorageService.getData('token') !== null &&
      this.auth.auth$ &&
      this.localStorageService.getData('role') === route.data.role
    ) {
      return true;
    } else {
      this.auth.logout();
      this.router.navigate(['login']);
      return false;
    }
  }
}
