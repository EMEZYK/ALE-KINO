import { Movie } from 'src/app/domains/movies/movie.interface';

export interface Watchlist {
  id: number;
  moviesIds: number[];
  userId: number;
}

export interface WatchlistWithMovies {
  watchlist: Watchlist;
  movies: Movie[];
}
