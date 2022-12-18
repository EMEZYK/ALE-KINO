import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../models/Ticket';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  private tickets$$ = new BehaviorSubject<Ticket[]>([]);

  get tickets$() {
    return this.tickets$$.asObservable();
  }

  constructor(private http: HttpClient) {}

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>('ticketsTypes');
  }
}
