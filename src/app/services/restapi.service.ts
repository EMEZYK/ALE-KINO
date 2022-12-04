import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { User } from '../models/User';
import {  map, Observable, mergeMap, tap } from 'rxjs';
import { Movie, Showing, MovieWithShowingTime } from '../models/Movie';
import { Ticket } from '../models/Ticket';

@Injectable({
  providedIn: 'root',
})
export class RestapiService {
  constructor(private http: HttpClient) {}

  getAllMoviesForDay(date: moment.Moment): Observable<MovieWithShowingTime[]> {
    return this.http
      .get<Showing[]>(this.getUrlForShowingsByDate(date.format('YYYY-MM-DD')))
      .pipe(
        tap((value) => {
          console.log(value);
        }),
        mergeMap((showings: Showing[]) => {
          const movieIds = showings.map((showing) => showing.movieId);

          if (movieIds.length === 0) {
            return [];
          }
          return this.http
            .get<Movie[]>(this.getUrlForMoviesByIds(movieIds))

            .pipe(
              map((movies) => {
                return movies.map((movie: Movie) => {
                  const matchingShowings: Showing[] = showings.filter(
                    (showing: Showing) => showing.movieId === movie.id
                  );
                  const movieWithShowings = {
                    showings: matchingShowings,
                    ...movie,
                  };
                  return movieWithShowings;
                });
              })
            );
        })
      );
  }

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>('tickets');
  }

  private getUrlForShowingsByDate(date: string) {
    return `showings?date=${date}`;
  }

  private getUrlForMoviesByIds(ids: number[]) {
    let url: string = `movies?`;
    if (ids.length > 0) {
      for (let i = 0; i < ids.length; i++) {
        url = url + `id=${ids[i]}&`;
      }
    }
    return url;
  }

  private getUser(isAdmin: boolean): Observable<User> {
    return this.http.get<User>('users' + isAdmin ? '2' : '1');
  }
}
