import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../users/user.interface';



@Injectable({
  providedIn: 'root',
})

export class AuthStateService {
  private http = inject(HttpClient);
  private loggedInUser$$ = new BehaviorSubject<User>(null);

  get auth$() {
    return this.loggedInUser$$.asObservable();
  }

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser !== '') this.setUser(JSON.parse(storedUser), false);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('users');
  }

  setUser(loggedInUser: User, storedProp = true) {
    if (storedProp) {
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    }
    this.loggedInUser$$.next(loggedInUser);
  }
}
