import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthLoginStateService } from 'src/app/domains/auth/auth-login.service';
import { Movie } from 'src/app/domains/movies/movie.interface';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import {
  MoviesWatchlistStateService,
  Watchlist,
  WatchlistWithMovies,
} from '../movies-watchlist/movies-watchlist.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manage-movie-panel',
  templateUrl: './manage-movie-panel.component.html',
  styleUrls: ['./manage-movie-panel.component.css'],
})
export class ManageMoviePanelComponent {
  private authService = inject(AuthLoginStateService);
  private watchlistService = inject(MoviesWatchlistStateService);

  @Input() movie: Movie;
  addedToWatchlist = false;
  eyeIcon = faEye;

  watchlistWithMovies$: Observable<WatchlistWithMovies> =
    this.watchlistService.watchlist$;

  isLoggedInUser =
    this.authService.auth$ && localStorage.getItem('role') === 'user';

  addToWatchList(movie: Movie, watchlist: Watchlist) {
    this.addedToWatchlist = true;

    this.watchlistService.addMovieToWatchlist(movie, watchlist);
  }

  removeFromWatchList(movie: Movie, watchlist: Watchlist) {
    this.addedToWatchlist = false;
    this.watchlistService.removeMovieFromWatchlist(movie, watchlist);
  }
}
