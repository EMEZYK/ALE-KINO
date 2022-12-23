import { ChoosenMovieShowing } from "../../movies/movie.interface";

export  interface Ticket {
    id: number;
    name: string;
    price: number;
    active: boolean;
    description: string
}

export interface chosenTicketsData extends Ticket, ChoosenMovieShowing {}
