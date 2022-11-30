export interface Movie {
  id: number;
  title: string;
  actors: string[];
  ageRating: string;
  description: string;
  director: string;
  duration: string;
  genres: string[];
  imageUrl: string;
  isPremiere: boolean;
  rating: string;
  year: number;
}

export interface Showing {
  movieId: number;
  date: string;
  time: Time;
  hall: Hall;
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
