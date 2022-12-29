import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, map, switchMap } from 'rxjs';
import { Ticket } from '../../booking/tickets/ticket.interface';
import {
  Movie,
  Showing,
  ChoosenMovieShowing,
  MovieWithShowingTime,
} from '../movie.interface';

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
        switchMap((showingsForDay: Showing[]) =>
          this.http
            .get<Movie[]>(
              this.getUrlForMovieWithShowingssByIds(
                this.extractMovieIds(showingsForDay)
              )
            )
            .pipe(
              map((movies: Movie[]) =>
                this.joinMoviesWithShowings(movies, showingsForDay)
              )
            )
        )
      );
  }

  getShowingWithMovieAndHall(
    showingId: number,
    date: moment.Moment
  ): Observable<ChoosenMovieShowing> {
    let url = `showings?`;
    url = `showings?id=${showingId}&date=${date.format(
      this.dateFormat
    )}&_expand=movie&_expand=hall`;

    return this.http
      .get<ChoosenMovieShowing>(url)
      .pipe(
        map((value: ChoosenMovieShowing | ChoosenMovieShowing[]) => {
          if (Array.isArray(value)) {
            return value[0];
          }
          return value;
        })
      );
  }

  private joinMoviesWithShowings(movies: Movie[], showingsForDay: Showing[]) {
    return movies.map((movie: Movie) => {
      const showings = showingsForDay.filter(
        (showing: Showing) => showing.movieId === movie.id
      );

      return { ...movie, showings };
    });
  }

  private getUrlForShowingsByDate(date: string) {
    return `showings?&date=${date}`;
  }

  private getUrlForMovieWithShowingssByIds(movieIds: number[]) {
    const idsAsString = movieIds.map((i) => i.toString()).join('&id=');
    return `movies?id=${idsAsString}`;
  }

  private extractMovieIds(showings: Showing[]) {
    return showings.map((el) => el.movieId);
  }

  getAllTickets(): Observable<Ticket[]> {
    console.log(this.http.get('ticketsTypes'));
    return this.http.get<Ticket[]>('ticketsTypes');
  }
}
