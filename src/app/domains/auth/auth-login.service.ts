import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserStateService } from 'src/app/core/user.state.service';
import { User } from '../users/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthLoginService {
  private htttp = inject(HttpClient);
  private router = inject(Router);
  private userStateService = inject(UserStateService);

  private auth$$ = new BehaviorSubject<{ hasAuth: boolean }>({
    hasAuth: false,
  });

  get auth$() {
    return this.auth$$.asObservable();
  }

  constructor() {
    this.manageLocalStorage();
  }

  login(email: string, password: string) {
    return this.htttp
      .post<any>('login', {
        email,
        password,
      })
      .pipe(
        tap({
          next: (response) => {
            const { accessToken, user } = response;

            this.auth$$.next({ hasAuth: true });
            localStorage.setItem('token', JSON.stringify(accessToken));
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', user.role )

            if(response.user.role === 'admin') {
                this.router.navigate(['/', 'admin']);
              }  else if (response.user.role === 'user') {
                this.router.navigate(['/', 'user']);
              } else {
                return
              }
          },
        })
      );
  }


  logout() {
    this.auth$$.next({
        ...this.auth$$.value,
        hasAuth: false,
      });

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role')
  }

  private manageLocalStorage() {
    if (localStorage.getItem('token')) {
      this.auth$$.next({ hasAuth: true });
    }
    const storedUser = localStorage.getItem('token');

    if (storedUser) {
      this.userStateService.setUser(JSON.parse(storedUser));
    }
  }

   handleNonAuthUser() {
     this.router.navigate['login']
  }


}
