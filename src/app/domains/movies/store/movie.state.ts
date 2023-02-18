import { Movie } from '../movie.interface';

export interface MovieState {
  movies: Movie[];
}

export const initialMovieState: MovieState = {
  movies: [],
};
