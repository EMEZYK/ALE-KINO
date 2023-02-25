import { Seat } from '../hall';
import { TicketType } from '../tickets';
import { ShowingWithMovie } from '../../movies/movie.interface';

export interface Order {
  id?: number;
  userId?: number;
  orderItems: {
    seatId: number;
    ticketId?: number;
  }[];
  showingId?: number;
  status: 'reserved' | 'paid';
}

interface SeatTicket {
  seat: Seat;
  ticket: TicketType;
}

export interface UserOrder {
  showingWithMovie: ShowingWithMovie;
  seatTickets: SeatTicket[];
  orderId: number;
}

export interface OrderDisplay {
  orderDate: string;
  movieTitle: string;
  numberOfTickets: number;
  details: { text: string; id: number };
}
