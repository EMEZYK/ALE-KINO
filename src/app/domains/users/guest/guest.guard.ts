import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { AuthLoginStateService } from '../../auth/auth-login.service';

import { LocalStorageService } from 'src/app/shared/local-storage';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  private router = inject(Router);
  private auth = inject(AuthLoginStateService);
  private localStorageService = inject(LocalStorageService);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.localStorageService.getData('role') === route.data.role) {
      return true;
    } else {
      this.auth.logout();
      this.router.navigate(['login']);
      return false;
    }
  }
}
