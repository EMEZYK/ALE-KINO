import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { TicketType } from './ticket.interface';

@Injectable({
  providedIn: 'root',
})
export class TicketsApiService {
  private http = inject(HttpClient);

  getTickets() {
    return this.http.get<TicketType[]>('ticketsTypes');
  }
}
