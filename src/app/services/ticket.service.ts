import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../models/Ticket';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private http: HttpClient) {}

    getAllTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>('ticketsTypes');
      }
  }