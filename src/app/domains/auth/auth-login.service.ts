import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserStateService } from 'src/app/core/user.state.service';

@Injectable({ providedIn: 'root' })
export class AuthLoginStateService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private userStateService = inject(UserStateService);

  private auth$$ = new BehaviorSubject<{ hasAuth: boolean }>({
    hasAuth: false,
  });

  userRole: string;

  get auth$() {
    return this.auth$$.asObservable();
  }

  constructor() {
    this.manageLocalStorage();
  }

  login(email: string, password: string) {
    return this.http
      .post<any>('login', {
        email,
        password,
      })
      .pipe(
        tap({
          next: (response) => {
            const { accessToken, user } = response;
            this.userStateService.setUser(user);
            this.auth$$.next({ hasAuth: true });
            localStorage.setItem('token', JSON.stringify(accessToken));
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', response.user.role);

            this.userRole = response.user.role;

            if (this.userRole === 'admin') {
              this.router.navigate(['/', 'admin']);
            } else if (this.userRole === 'user') {
              this.router.navigate(['/', 'user']);
            }
          },
        })
      );
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    this.auth$$.next({
      ...this.auth$$.value,
      hasAuth: false,
    });
  }

  private manageLocalStorage() {
    if (localStorage.getItem('token')) {
      this.auth$$.next({ hasAuth: true });
    }
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      this.userStateService.setUser(JSON.parse(storedUser));
    }
  }

  handleNonAuthUser() {
    this.router.navigate['login'];
  }
}

// export interface AuthResponse {
//   accessToken: string;
//   user: {
//     email: string;
//     id: number;
//   };
// }
