import { Seat } from '../booking/hall/hall.interface';

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
  movie?: Movie;
  hallId: number;
  date: string;
  movieBreak: number;
  timeFrom: string;
  timeTo: string;
}

export interface NewShowing {
  movieId: number;
  hallId: number;
  date: string;
  movieBreak: number;
  timeFrom: string;
  timeTo: string;
}

interface Hall {
  id: number;
  name: string;
  number: number;
  rows: number;
  columns: number;
}

interface Genre {
  id: number;
  name: string;
}

export interface ChoosenMovieShowing extends Movie, Showing, Hall {}

export interface ShowingWithMovie extends Showing {
  movie: Movie;
}

export interface MovieWithShowingTime extends Movie {
  showings: Showing[];
}
