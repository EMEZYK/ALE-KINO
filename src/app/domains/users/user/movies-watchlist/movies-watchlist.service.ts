import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { UserStateService } from 'src/app/core/user.state.service';
import { Movie } from 'src/app/domains/movies/movie.interface';
import { User } from '../../user.interface';

@Injectable({
  providedIn: 'root',
})
export class MoviesWatchlistStateService {
  private http = inject(HttpClient);
  private user$ = inject(UserStateService).user$;

  private watchlist$$ = new BehaviorSubject<Movie[]>([]);

  get watchlist$() {
    return this.watchlist$$.asObservable();
  }
  constructor() {}

  addMovieToWatchlist(movie: Movie) {
    this.user$
      .pipe(
        tap((user: User) => {
          this.http
            .post(`users?id=${user.id}.moviestowatch`, movie, {
              headers: new HttpHeaders().set(
                'Authorization',
                'Bearer ' + localStorage.getItem('token')!
              ),
            })
            .subscribe();
        })
      )
      .subscribe(() => {
        this.watchlist$$.next([...this.watchlist$$.value, movie]);
      });
  }

  removeMovieFromWatchlist(movieId: number) {
    this.watchlist$$.next(
      this.watchlist$$.value.filter((movie) => movie.id !== movieId)
    );
  }

  isAlreadyOnWatchlist(movieId: number) {
    console.log('tu', movieId);
    return this.watchlist$$.value.some((movie) => movie.id === movieId);
  }
}
