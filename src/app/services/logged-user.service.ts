import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoggedUserService {
  private loggedInUser$$ = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {
    let storedUser = localStorage.getItem('user');
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
