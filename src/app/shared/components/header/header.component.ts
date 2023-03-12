import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { map, Observable, tap } from 'rxjs';
import { Location, NgIf, AsyncPipe } from '@angular/common';
import { AuthLoginStateService } from 'src/app/domains/auth/auth-login.service';
import { UserStateService } from 'src/app/core/user.state.service';
import { User, UserRole } from 'src/app/domains/users/user.interface';
import { SeatTicketsStateService } from 'src/app/domains/booking/order';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { ButtonComponent } from '../button/button.component';
import * as moment from 'moment';
import { OrderStateService } from 'src/app/domains/booking/order/order.state.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private authService = inject(AuthLoginStateService);
  private userService = inject(UserStateService);
  private orderService = inject(OrderStateService);
  private router = inject(Router);
  private location = inject(Location);

  order$ = this.orderService.order$.pipe(
    map((order) => {
      return order.orderItems ? order.orderItems.length : 0;
    })
  );

  user$: Observable<User> = this.userService.user$;
  userRole: UserRole;
  cinemaName = 'Ale kino!';
  isAuthenticated = false;
  isDropdownVisible = false;
  shoppingCartIcon = faShoppingCart;

  dropdownUserOptions = [
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

  dropdownAdminOptions = [
    {
      routerlink: 'login',
      text: 'Wyloguj',
      shouldLogOut: true,
      parentPath: '',
    },
  ];

  logout() {
    this.isAuthenticated = false;
    this.isDropdownVisible = false;

    this.authService.logout();
    window.location.reload();
  }

  date = moment().format('YYYY-MM-DD');

  navigateHome(userRole: UserRole) {
    if (userRole === 'admin') {
      this.router.navigate([`admin`]);
    } else if (userRole === 'user') {
      this.router.navigate([`user/home/${this.date}`]);
    } else {
      this.router.navigate([`home/${this.date}`]);
    }
  }

  navigateLogin() {
    this.router.navigate(['login']);
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  navigateToPreviousPage(): void {
    this.location.back();
  }
}
