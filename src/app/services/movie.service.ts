import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, mergeMap, tap, map } from 'rxjs';
import {
  Movie,
  Showing,
  ChoosenMovieShowing,
  MovieWithShowingTime,
} from '../models/Movie';
import { Ticket } from '../models/Ticket';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  dateFormat = 'YYYY-MM-DD';

  constructor(private http: HttpClient) {}

  getAllMoviesForDay(date: moment.Moment): Observable<MovieWithShowingTime[]> {
    return this.http
      .get<Showing[]>(
        this.getUrlForShowingsByDate(date.format(this.dateFormat))
      )
      .pipe(
        mergeMap((showings: Showing[]) => {
          const movieIds = showings.map((showing) => showing.movieId);
          if (movieIds.length === 0) {
            return [];
          }
          return this.http
            .get<Movie[]>(this.getUrlForMovieWithShowingssByIds(movieIds))
        })
      );
  }

  getShowingWithMovieAndHall(
    showingId: number,
    date: moment.Moment
  ): Observable<ChoosenMovieShowing> {
    let url: string = `showings?`;
    url = `showings?id=${showingId}&date=${date.format(
      this.dateFormat
    )}&_expand=movie&_expand=hall`;

    return this.http.get<ChoosenMovieShowing>(url)
    
    .pipe(
      map((value: ChoosenMovieShowing | ChoosenMovieShowing[]) => {
        if (Array.isArray(value)) {
          return value[0];
        }
        return value;
      })
    );
  }

  getAllTickets(): Observable<Ticket[]> {
    console.log(this.http.get('ticketsTypes'));
    return this.http.get<Ticket[]>('ticketsTypes');
  }

  private getUrlForShowingsByDate(date: string) {
    return `showings?&date=${date}`;
  }

  private getUrlForMovieWithShowingssByIds(ids: number[]) {
    let url: string = `movies?`;
    if (ids.length > 0) {
      for (let i = 0; i < ids.length; i++) {
        url = url + `id=${ids[i]}&_embed=showings`;
      }
    }
    return url;
  }
}
