import { Seat } from '../hall';
import { TicketType } from '../tickets';
import { ShowingWithMovie } from '../../movies/movie.interface';

export interface Order {
  userId: number;
  orderItems: {
    seatId: number;
    ticketId: number;
  }[];
  showingId: number;
  status: 'reserved' | 'paid';
}

interface SeatTicket {
  seat: Seat;
  ticket: TicketType;
}

export interface UserOrder {
  showingWithMovie: ShowingWithMovie;
  seatTickets: SeatTicket[];
}

export interface OrderDisplay {
  orderDate: string;
  movieTitle: string;
  numberOfTickets: number;
  details: { text: string; id: number };
}
