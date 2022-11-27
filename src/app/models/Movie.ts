export interface Movie {
  id: number;
  title: string;
  actors: string[];
  ageRating: string;
  description: string;
  director: string;
  duration: string;
  genres: string[];
  hallBumber: number;
  imageUrl: string;
  isPremiere: boolean;
  rating: string;
  year: number;
}

export interface Showing {
  movieId: number;
  date: string;
  times: Array<Time>;
}


interface Time {
  hour: number;
  minute: number;
}


export interface MovieWithShowingTime extends Movie, Showing {}

