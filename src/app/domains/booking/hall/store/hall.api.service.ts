import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Hall } from '../hall.interface';

@Injectable({
  providedIn: 'root',
})
export class HallApiService {
  private http = inject(HttpClient);

  getHalls() {
    return this.http.get<Hall[]>(`halls`);
  }
}
