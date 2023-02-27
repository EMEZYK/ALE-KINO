import { TicketType } from '../tickets/ticket.interface';

export interface Hall {
  id: number;
  name: string;
  number: number;
  rows: number;
  columns: number;
}

export interface Seat {
  id: number;
  row: string;
  column: number;
  vip: boolean;
  hallId: number;
}

export interface SeatTicket {
  seat: Seat;
  ticket: TicketType;
  showingId: number;
}
