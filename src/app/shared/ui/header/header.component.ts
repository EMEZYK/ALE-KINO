import { Component, inject, OnInit } from '@angular/core';
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
  authService = inject(AuthLoginService);

  ngOnInit(): void {
    this.hasAuth().subscribe();
  }

  hasAuth = () => {
    return this.authService.auth$.pipe(
      tap((value) => {
        console.log(value)
        if (value.hasAuth === true) {
          this.isAuthenticated = true
        } 
      })
    );
  };

logout() {
  this.isAuthenticated = false;
  this.authService.logout()
}


}
