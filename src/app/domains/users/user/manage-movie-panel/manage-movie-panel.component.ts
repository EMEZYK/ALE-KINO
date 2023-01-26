import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { faEye } from '@fortawesome/free-solid-svg-icons';

import { AuthLoginStateService } from 'src/app/domains/auth/auth-login.service';
import { MoviesWatchlistStateService } from '../movies-watchlist/movies-watchlist.service';
import { Movie } from 'src/app/domains/movies/movie.interface';
import {
  WatchlistWithMovies,
  Watchlist,
} from '../movies-watchlist/watchlist.interface';

@Component({
  selector: 'app-manage-movie-panel',
  templateUrl: './manage-movie-panel.component.html',
  styleUrls: ['./manage-movie-panel.component.css'],
})
export class ManageMoviePanelComponent {
  @Input() movie: Movie;

  private authService = inject(AuthLoginStateService);
  private watchlistService = inject(MoviesWatchlistStateService);

  watchlistWithMovies$: Observable<WatchlistWithMovies> =
    this.watchlistService.watchlist$;

  eyeIcon = faEye;

  isLoggedInUser =
    this.authService.auth$ && localStorage.getItem('role') === 'user';

  checkIfMovieIsOnWatchlist(
    movie: Movie,
    watchlistWithMovies: WatchlistWithMovies
  ): boolean {
    return watchlistWithMovies.movies.some(
      (foundMovie) => foundMovie.id === movie.id
    );
  }

  toggleWatchlist(
    movie: Movie,
    watchlistWithMovies: WatchlistWithMovies
  ): void {
    if (this.checkIfMovieIsOnWatchlist(movie, watchlistWithMovies)) {
      this.watchlistService.removeMovieFromWatchlist(
        movie,
        watchlistWithMovies.watchlist
      );
    } else {
      this.watchlistService.addMovieToWatchlist(
        movie,
        watchlistWithMovies.watchlist
      );
    }
  }
}
