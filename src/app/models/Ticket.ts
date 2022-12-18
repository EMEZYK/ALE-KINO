import { ChoosenMovieShowing } from "./Movie";

export  interface Ticket {
    id: number;
    name: string;
    price: number;
    active: boolean;
    description: string
}

export interface chosenTicketsData extends Ticket, ChoosenMovieShowing {}
