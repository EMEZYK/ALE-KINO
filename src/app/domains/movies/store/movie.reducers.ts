import { createReducer, on } from '@ngrx/store';
import { MovieApiActions } from './movie.actions';
import { initialMovieState } from './movie.state';

import { MovieState } from './movie.state';

export const MovieReducer = createReducer(
  initialMovieState,

  on(
    MovieApiActions.moviesLoadedSuccess,
    (state, { movies }): MovieState => ({ ...state, movies })
  )
);
