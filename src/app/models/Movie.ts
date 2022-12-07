import { ScreeningHall } from "./ScreeningHall";

export interface Movie {
  id: number;
  title: string;
  ageRestrictions: string;
  shortDescription: string;
  longDescription: string;
  duration: number;
  genres: string[];
  image: string;
  isPremiere: boolean;
  rating: string;
  timeFrom: string,
  timeTo: string
}

export interface Showing {
  movieId: number;
  date: string;
  time: Time;
  screeningHalls: ScreeningHall[];
}

interface Time {
  hour: number;
  minute: number;
}

interface Hall {
  number: number;
  seats: Seat[];
}

interface Seat {
  row: string;
  num: number;
  status: 'FREE' | 'TAKEN';
}

export interface MovieWithShowingTime extends Movie {
  showings: Showing[];
}

export interface ChoosenMovieShowing extends Movie, Showing {}
