import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Observable, map, switchMap } from 'rxjs';
import {
  Movie,
  Showing,
  ChoosenMovieShowing,
  MovieWithShowingTime,
} from '../movie.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieApiService {
  private http = inject(HttpClient);
  dateFormat = 'YYYY-MM-DD';

  getAllMovies() {
    return this.http.get<Movie[]>('movies');
  }

  getAllMoviesByIds(movieIds: number[]) {
    return this.http.get<Movie[]>(`movies?id=${movieIds.join('&id=')}`);
  }

  getAllMoviesForDay(date: Moment): Observable<MovieWithShowingTime[]> {
    return this.http
      .get<Showing[]>(
        this.getUrlForShowingsByDate(moment(date).format(this.dateFormat))
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
    date: Moment
  ): Observable<ChoosenMovieShowing> {
    let url = `showings?`;
    url = `showings?id=${showingId}&date=${date.format(
      this.dateFormat
    )}&_expand=movie&_expand=hall`;

    return this.http.get<ChoosenMovieShowing>(url).pipe(
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
}
