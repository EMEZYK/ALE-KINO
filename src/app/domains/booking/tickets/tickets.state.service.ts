import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { TicketType } from './ticket.interface';
import { TicketsApiService } from './tickets.api.service';

@Injectable({
  providedIn: 'root',
})
export class TicketsStateService {
  private ticketsApiService = inject(TicketsApiService);

  private ticketTypes$$ = new BehaviorSubject<TicketType[]>([]);

  get ticketTypes$() {
    return this.ticketTypes$$.asObservable();
  }

  constructor() {
    this.ticketsApiService
      .getTickets()
      .subscribe((tickets: TicketType[]) => this.ticketTypes$$.next(tickets));
  }

  setTicket(ticket: TicketType) {
    this.ticketTypes$$.next({ ...this.ticketTypes$$.value, ...ticket });
    return ticket;
  }
}
