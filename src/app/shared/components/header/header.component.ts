import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { tap } from 'rxjs';

import { AuthLoginService } from 'src/app/domains/auth/auth-login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cinemaName = 'Ale kino!';
  isAuthenticated = false;
  isDropdownVisible = false;
  shoppingCartIcon = faShoppingCart;

  public dropdownUserOptions = [
    { routerlink: 'orders', text: 'Moje bilety', parentPath: 'user' },
    { routerlink: 'wishlist', text: 'Chcę obejrzeć', parentPath: 'user' },
    { routerlink: 'settings', text: 'Ustawienia', parentPath: 'user' },
    {
      routerlink: 'login',
      text: 'Wyloguj',
      shouldLogOut: true,
      parentPath: '',
    },
  ];

  public dropdownAdminOptions = [{ routerlink: 'login', text: 'Wyloguj' }];

  authService = inject(AuthLoginService);
  router = inject(Router);

  ngOnInit(): void {
    this.hasAuth().subscribe();
  }

  hasAuth = () => {
    return this.authService.auth$.pipe(
      tap((value) => {
        if (value.hasAuth === true) {
          this.isAuthenticated = true;
        }
      })
    );
  };

  logout() {
    this.isAuthenticated = false;
    this.authService.logout();
    this.isDropdownVisible = false;
  }

  navigateHome() {
    if (this.authService.userRole === 'admin') {
      this.router.navigate([`admin`]);
    } else if (this.authService.userRole === 'user') {
      this.router.navigate([`user`]);
    } else {
      this.router.navigate(['home']);
    }
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
}
