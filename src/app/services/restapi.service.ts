import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {
  catchError,
  map,
  Observable,
  mergeMap,
  tap,
  EMPTY,
} from 'rxjs';
import { Movie, Showing, MovieWithShowingTime } from '../models/Movie';
import { Ticket } from '../models/Ticket';

@Injectable({
  providedIn: 'root',
})
export class RestapiService {
  baseUrl: string = 'http://localhost:3000';

  private moviesUrl = this.baseUrl + '/movies';
  private showingsUrl = this.baseUrl + '/showings';
  private ticketsUrl = this.baseUrl + '/tickets';


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
                  const matchingShowing: Showing = showings.find(
                    (showing: Showing) => showing.movieId === movie.id
                  );
                  const movieWithShowings = {
                    date: matchingShowing.date,
                    times: matchingShowing.times,
                    ...movie,
                  };
                  return movieWithShowings;
                });
              })
            );
        }),

        tap((value) => {
          console.log(value);
        }),

        catchError((err: HttpErrorResponse) => {
          return EMPTY;
        })
      );
  }

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<any>(this.ticketsUrl).pipe(
      tap((value) => {
        console.log(value);
      }),
      catchError((err: HttpErrorResponse) => {
        return EMPTY;
      })
    );
  }

  getShowingsForDayAndMovieId(
    movieId: number,
    date: string
  ): Observable<Showing[]> {
    return this.http
      .get<any>(this.getUrlForShowingsByDateAndMovieId(movieId, date))
      .pipe(
        tap((value) => {
          console.log(value);
        }),
        catchError((err: HttpErrorResponse) => {
          return EMPTY;
        })
      );
  }

  private getUrlForShowingsByDateAndMovieId(movieId: number, date: string) {
    return `${this.showingsUrl}?movieId=${movieId}&date=${date}`;
  }

  private getUrlForShowingsByDate(date: string) {
    return `${this.showingsUrl}?date=${date}`;
  }

  private getUrlForMoviesByIds(ids: number[]) {
    let url: string = `${this.moviesUrl}?`;
    if (ids.length > 0) {
      for (let i = 0; i < ids.length; i++) {
        url = url + `id=${ids[i]}&`;
      }
    }
    return url;
  }
}
