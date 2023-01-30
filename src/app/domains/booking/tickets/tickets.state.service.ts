import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ticket } from './ticket.interface';

@Injectable({
  providedIn: 'root',
})
export class TicketsStateService {
  private tickets$$ = new BehaviorSubject<Ticket[]>([]);

  get tickets$() {
    return this.tickets$$.asObservable();
  }

  constructor(private http: HttpClient) {
    this.fetchTickets();
  }

  fetchTickets() {
    return this.http
      .get<Ticket[]>('ticketsTypes')
      .subscribe((tickets: Ticket[]) => this.tickets$$.next(tickets));
  }

  setTicket(ticket) {
    this.tickets$$.next({ ...this.tickets$$.value, ...ticket });
  }
}
