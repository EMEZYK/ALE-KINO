import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { MovieService } from './repertoire.service';
import { MovieActions, MovieApiActions } from './repertoire.actions';

@Injectable()
export class MovieEffects {
  private movieActions$ = inject(Actions);
  private movieService = inject(MovieService);

  getMovies$ = createEffect(() => {
    return this.movieActions$.pipe(
      ofType(MovieActions.getMovies),
      switchMap(() => this.movieService.getAllMovies()),
      map((movies) => MovieApiActions.moviesLoadedSuccess({ movies })),
      catchError(() => {
        return of(MovieApiActions.moviesLoadedFailure);
      })
    );
  });

  addMovie$ = createEffect(() => {
    return this.movieActions$.pipe(
      ofType(MovieActions.addMovie),
      switchMap(({ movie, isActive }) =>
        this.movieService.addMovie(movie, isActive)
      ),
      map((movie) => MovieApiActions.movieAddedSuccess({ movie })),
      catchError(() => {
        return of(MovieApiActions.movieAddedFailure);
      })
    );
  });
}
