import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../models/Ticket';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private http: HttpClient) {}

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>('ticketsTypes');
  }

  private ticketBehavioralSubject = new BehaviorSubject<Ticket | undefined>(
    undefined
  );
  ticket = this.ticketBehavioralSubject.asObservable();

  setTicket(ticket: Ticket) {
    this.ticketBehavioralSubject.next(ticket);
  }
}
