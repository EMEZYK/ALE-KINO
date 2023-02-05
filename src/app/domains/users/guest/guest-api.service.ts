import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guest } from '../user.interface';

@Injectable({
  providedIn: 'root',
})
export class GuestApiService {
  private http = inject(HttpClient);

  createGuestAccount(guest: Guest): Observable<Guest> {
    return this.http.post<Guest>('guests', guest);
  }
}
