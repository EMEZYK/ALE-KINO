import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoggedUserService {
  constructor(private http: HttpClient) {}

  getUser(isAdmin: boolean): Observable<User> {
    return this.http.get<User>(`users/${isAdmin ? '2' : '1'}`);
  }
}
