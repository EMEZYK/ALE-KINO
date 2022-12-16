import { Ticket } from "./Ticket";

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


export interface chosenSeatsAndTickets {
  seat: Seat,
  ticket: Ticket
}