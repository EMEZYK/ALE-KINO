import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, concatMap, map, Observable } from 'rxjs';
import { MovieRating } from './movie-rating.interface';
import { UserStateService } from 'src/app/core/user.state.service';
import { User } from '../../user.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieRatingStateService {
  private http = inject(HttpClient);
  private userService = inject(UserStateService);

  private ratings$$ = new BehaviorSubject<MovieRating[]>([]);

  get ratings$() {
    return this.ratings$$.asObservable();
  }

  constructor() {
    this.getRatings();
  }

  private getRatings() {
    return this.http
      .get<MovieRating[]>('ratings')
      .subscribe((ratings: MovieRating[]) => {
        this.ratings$$.next(ratings);
      });
  }

  getOverallRatingForMovie(movieId: number): Observable<number> {
    return this.ratings$$.pipe(
      map((ratings: MovieRating[]) => {
        const filteredRatings = ratings.filter((el) => el.movieId === movieId);

        const count = filteredRatings.length;

        const sum = filteredRatings
          .map((el) => el.userRating)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        return sum / count;
      })
    );
  }

  getUserMovieRating(movieId: number): Observable<number> {
    return this.userService.user$.pipe(
      concatMap((user: User) => {
        return this.ratings$$.pipe(
          map((ratings: MovieRating[]) => {
            const userRatings = ratings.filter(
              (el) => el.userId === user.id && el.movieId === movieId
            );

            if (userRatings.length !== 0) {
              return userRatings[0].userRating;
            }
            return null;
          })
        );
      })
    );
  }

  addRating(movieId: number, userRating: number) {
    return this.userService.user$
      .pipe(
        concatMap((user: User) => {
          return this.http.post<MovieRating>('ratings', {
            userId: user.id,
            movieId,
            userRating,
          });
        })
      )
      .subscribe(() => {
        this.getRatings();
      });
  }
}
