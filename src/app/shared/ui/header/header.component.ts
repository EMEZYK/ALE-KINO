import { Component, inject, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { AuthStateService } from 'src/app/domains/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cinemaName = 'Ale kino!';
  isAuthenticated = false;
  authService = inject(AuthStateService);

  ngOnInit(): void {
    this.hasAuth().subscribe();
  }

  hasAuth = () => {
    return this.authService.auth$.pipe(
      tap((value) => {
        if (value) {
          this.isAuthenticated = true
        } 
      })
    );
  };

logout() {
  this.isAuthenticated = false;
  localStorage.removeItem('user');
}


}
