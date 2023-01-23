import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthLoginStateService } from 'src/app/domains/auth/auth-login.service';
import { Movie } from 'src/app/domains/movies/movie.interface';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { MoviesWatchlistStateService } from '../movies-watchlist/movies-watchlist.service';

@Component({
  selector: 'app-manage-movie-panel',
  templateUrl: './manage-movie-panel.component.html',
  styleUrls: ['./manage-movie-panel.component.css'],
})
export class ManageMoviePanelComponent {
  @Input() movie: Movie;
  addedToWatchlist = false;
  eyeIcon = faEye;

  private authService = inject(AuthLoginStateService);
  private watchlistService = inject(MoviesWatchlistStateService);

  isLoggedInUser =
    this.authService.auth$ && this.authService.userRole === 'user';

  addToWatchList(movie: Movie) {
    this.addedToWatchlist = true;

    if (this.watchlistService.isAlreadyOnWatchlist(movie.id) === false) {
      this.watchlistService.addMovieToWatchlist(movie);
    }
  }

  removeFromWatchList(movieId: number) {
    this.addedToWatchlist = false;

    this.watchlistService.removeMovieFromWatchlist(movieId);
  }
}
