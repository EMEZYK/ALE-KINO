import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScreeningHall } from '../models/ScreeningHall';
import { Ticket } from '../models/Ticket';

@Injectable({
  providedIn: 'root',
})
export class ScreeningHallService {
  constructor(private http: HttpClient) {}

    getScreeningHall(): Observable<ScreeningHall[]> {
        return this.http.get<ScreeningHall[]>('screeningHalls?_embed=showings');
      }
  }