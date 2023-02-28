import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TicketType } from './ticket.interface';

@Injectable({
  providedIn: 'root',
})
export class TicketsStateService {
  private http = inject(HttpClient);
  private ticketTypes$$ = new BehaviorSubject<TicketType[]>([]);

  get ticketTypes$() {
    return this.ticketTypes$$.asObservable();
  }

  constructor() {
    this.fetchTickets().subscribe((tickets: TicketType[]) =>
      this.ticketTypes$$.next(tickets)
    );
  }

  fetchTickets() {
    return this.http.get<TicketType[]>('ticketsTypes');
  }

  setTicket(ticket: TicketType) {
    this.ticketTypes$$.next({ ...this.ticketTypes$$.value, ...ticket });
    return ticket;
  }
}
