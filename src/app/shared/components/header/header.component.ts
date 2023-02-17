import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { map, Observable, tap } from 'rxjs';
import { Location, NgIf, AsyncPipe } from '@angular/common';

import { AuthLoginStateService } from 'src/app/domains/auth/auth-login.service';
import { UserStateService } from 'src/app/core/user.state.service';
import { User } from 'src/app/domains/users/user.interface';
import { SeatTicketsStateService } from 'src/app/domains/booking/order';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { ButtonComponent } from '../button/button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    DropdownMenuComponent,
    FontAwesomeModule,
    NgIf,
    AsyncPipe,
    ButtonComponent,
    RouterModule,
  ],
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthLoginStateService);
  private userService = inject(UserStateService);
  private router = inject(Router);
  private location = inject(Location);
  order$ = inject(SeatTicketsStateService).seatTickets$.pipe(
    map((orderItems) => {
      return orderItems ? orderItems.length : 0;
    })
  );

  user$: Observable<User>;

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

  ngOnInit(): void {
    this.hasAuth().subscribe();

    this.user$ = this.userService.user$;
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
    this.isDropdownVisible = false;

    this.authService.logout();
    window.location.reload();
  }

  navigateHome() {
    if (this.authService.userRole === 'admin') {
      this.router.navigate([`admin`]);
    } else if (this.authService.userRole === 'user') {
      this.router.navigate([`user`]);
    } else {
      this.router.navigate([`home`]);
    }
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  navigateToPreviousPage(): void {
    this.location.back();
  }
}
