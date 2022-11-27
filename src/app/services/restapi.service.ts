import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { catchError, map, of, Observable, throwError, mergeMap } from 'rxjs';
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
      .get<any>(this.getUrlForShowingsByDate(date.format('YYYY-MM-DD')))
      .pipe(
        mergeMap((showings: Showing[]) => {
          const movieIds = showings.map((showing) => showing.movieId);
          if (movieIds.length === 0) {
            return [];
          }
          return this.http.get<any>(this.getUrlForMoviesByIds(movieIds)).pipe(
            map((movies) => {
              return movies.map((movie) => {
                return {
                  times: showings.find(
                    (showing) => showing.movieId === movie.id
                  ).times,
                  ...movie,
                };
              });
            })
          );
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<any>(this.ticketsUrl).pipe(
      catchError((err) => {
        return throwError(err);
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
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  private getUrlForShowingsByDateAndMovieId(movieId: number, date: string) {
    return `${this.showingsUrl}?movieId=${movieId}&date=${date}`;
  }

  private getUrlForShowingsByDate(date: string) {
    console.log(`${this.showingsUrl}?date=${date}`);
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
