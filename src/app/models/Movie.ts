import { Seat } from "./Hall";

export interface Movie {
  id: number;
  title: string;
  duration: number;
  ageRestrictions: string;
  genres: Genre[];
  shortDescription: string;
  longDescription: string;
  image: string;
  rating: string;
  isPremiere: boolean;
}

export interface Showing {
  id: number;
  movieId: number;
  hallId: number;
  date: string;
  break: number;
  timeFrom: string;
  timetTo: string;
  paidSeats: Seat[];
  bookedSeats: Seat[];
}


interface Hall {
  id: number;
  name: string;
  number: number;
  rows: number;
  columns: number;
}

interface Genre {
  id: number,
  name: string
}


export interface ChoosenMovieShowing extends Movie, Showing, Hall {}

export interface ShowingWithMovie extends Showing {
  movie: Movie;
}

export interface MovieWithShowingTime extends Movie {
  showings: Showing[];
}

