import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { UserStateService } from 'src/app/core/user.state.service';
import { MovieService } from 'src/app/domains/movies/movie-list';
import { Movie } from 'src/app/domains/movies/movie.interface';
import { User } from '../../user.interface';

export interface Watchlist {
  id: number;
  moviesIds: number[];
  userId: number;
}

export interface WatchlistWithMovies {
  watchlist: Watchlist;
  movies: Movie[];
}

@Injectable({
  providedIn: 'root',
})
export class MoviesWatchlistStateService {
  private http = inject(HttpClient);
  private user$ = inject(UserStateService).user$;
  private movieService = inject(MovieService);

  private watchlist$$ = new BehaviorSubject<WatchlistWithMovies>(null);

  get watchlist$() {
    return this.watchlist$$.asObservable();
  }

  private user: User;

  constructor() {
    this.getUserWatchlist();
  }

  private getWatchlistWithMovies(
    watchlist: Watchlist
  ): Observable<WatchlistWithMovies> {
    return this.movieService.getAllMoviesByIds(watchlist.moviesIds).pipe(
      map((movies: Movie[]) => {
        return {
          watchlist,
          movies,
        };
      })
    );
  }

  private getUserWatchlist() {
    return this.user$
      .pipe(
        switchMap((user: User): Observable<Watchlist[]> => {
          return this.http.get<Watchlist[]>(`watchlists?userId=${user.id}`);
        }),
        map((watchlists) => watchlists[0]),
        switchMap((watchlist: Watchlist): Observable<WatchlistWithMovies> => {
          return this.getWatchlistWithMovies(watchlist);
        })
      )
      .subscribe((watchlistWithMovies: WatchlistWithMovies) => {
        this.watchlist$$.next(watchlistWithMovies);
      });
  }

  private patchWatchlist(watchlistId: number, newMovieIds: number[]) {
    this.http
      .patch<Watchlist>(`watchlists/${watchlistId}`, {
        moviesIds: newMovieIds,
      })
      .pipe(
        switchMap((watchlist: Watchlist): Observable<WatchlistWithMovies> => {
          return this.getWatchlistWithMovies(watchlist);
        })
      )
      .subscribe((watchlistWithMovies: WatchlistWithMovies) => {
        this.watchlist$$.next(watchlistWithMovies);
      });
  }

  addMovieToWatchlist(movie: Movie, watchlist: Watchlist) {
    if (!watchlist.moviesIds.includes(movie.id)) {
      watchlist.moviesIds.push(movie.id);
    }

    if (!watchlist) {
      this.http
        .post<Watchlist>('watchlists', {
          userId: this.user.id,
          moviesIds: [movie.id],
        })
        .pipe(
          switchMap((watchlist: Watchlist) =>
            this.getWatchlistWithMovies(watchlist)
          )
        )
        .subscribe((watchlistWithMovies: WatchlistWithMovies) =>
          this.watchlist$$.next(watchlistWithMovies)
        );
    } else {
      this.patchWatchlist(watchlist.id, watchlist.moviesIds);
    }
  }

  removeMovieFromWatchlist(movie: Movie, watchlist: Watchlist) {
    const updatedMovieIds = watchlist.moviesIds.filter((id) => id !== movie.id);
    this.patchWatchlist(watchlist.id, updatedMovieIds);
  }
}
