import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { Observable, tap } from 'rxjs';
import { faEye, faStar } from '@fortawesome/free-solid-svg-icons';

import { AuthLoginStateService } from 'src/app/domains/auth/auth-login.service';
import { MoviesWatchlistStateService } from '../movie-watchlist/movies-watchlist.service';
import { Movie } from 'src/app/domains/movies/movie.interface';
import { WatchlistWithMovies } from '../movie-watchlist/watchlist.interface';
import { MovieRatingStateService } from '../movie-rating/movie-rating.state.service';
import { LocalStorageService } from 'src/app/shared/local-storage';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-manage-movie-panel[movie]',
  templateUrl: './manage-movie-panel.component.html',
  styleUrls: ['./manage-movie-panel.component.css'],
  standalone: true,
  imports: [NgIf, ButtonComponent, FontAwesomeModule, NgFor, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageMoviePanelComponent {
  @Input() movie: Movie;

  private authService = inject(AuthLoginStateService);
  private watchlistService = inject(MoviesWatchlistStateService);
  private ratingService = inject(MovieRatingStateService);
  private localStorageService = inject(LocalStorageService);

  watchlistWithMovies$: Observable<WatchlistWithMovies> =
    this.watchlistService.watchlist$;

  isLoggedInUser =
    this.authService.auth$ &&
    this.localStorageService.getData('role') === 'user';

  rating: number;
  showRating = false;
  starIcon = faStar;
  eyeIcon = faEye;
  stars: number[] = Array(10);

  getOveralRating(movieId: number): Observable<number> {
    return this.ratingService.getOverallRatingForMovie(movieId);
  }

  getUserRating(movieId: number): Observable<number> {
    return this.ratingService.getUserMovieRating(movieId);
  }

  setRating(movieId: number, newRating: number) {
    this.rating = newRating;

    this.ratingService.addRating(movieId, newRating);
    this.showRating = false;
  }

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
