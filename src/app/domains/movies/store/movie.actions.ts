import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { Movie } from '../movie.interface';

export const MovieActions = createActionGroup({
  source: 'Movie',
  events: {
    'get movies': emptyProps(),
    'add movie': props<{ movie: Movie }>(),
  },
});

export const MovieApiActions = createActionGroup({
  source: 'Movie API',
  events: {
    'movies loaded success': props<{ movies: Movie[] }>(),
    'movies loaded failure': emptyProps(),

    'movie added success': props<{ movie: Movie }>(),
    'movie added failure': emptyProps(),
  },
});
