import { createReducer, on } from '@ngrx/store';
import { MovieApiActions } from './repertoire.actions';
import { initialMovieState } from './repertoire.state';

import { MovieState } from './repertoire.state';

export const MovieReducer = createReducer(
  initialMovieState,

  on(
    MovieApiActions.moviesLoadedSuccess,
    (state, { movies }): MovieState => ({ ...state, movies })
  )
);
