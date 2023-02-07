import { ChoosenMovieShowing } from '../../movies/movie.interface';

export interface TicketType {
  id: number;
  name: string;
  price: number;
  active: boolean;
  description: string;
}

export interface chosenTicketsData extends TicketType, ChoosenMovieShowing {}
