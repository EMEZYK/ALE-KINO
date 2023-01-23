import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { User } from '../domains/users/user.interface';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private user$$ = new ReplaySubject<User>(1);

  get user$() {
    return this.user$$.asObservable();
  }

  setUser(user: User) {
    this.user$$.next(user);
  }
}
