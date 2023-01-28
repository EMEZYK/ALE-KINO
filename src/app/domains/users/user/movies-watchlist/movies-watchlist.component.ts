import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { faEye } from '@fortawesome/free-solid-svg-icons';

import { MoviesWatchlistStateService } from './movies-watchlist.service';
import { Watchlist, WatchlistWithMovies } from './watchlist.interface';
import { Movie } from 'src/app/domains/movies/movie.interface';
import { MovieRatingStateService } from '../movie-rating/movie-rating.state.service';

@Component({
  selector: 'app-movies-to-watch',
  templateUrl: './movies-watchlist.component.html',
  styleUrls: ['./movies-watchlist.component.css'],
})
export class MoviesToWatchComponent implements OnInit {
  private watchlistService = inject(MoviesWatchlistStateService);
  private movieRatingService = inject(MovieRatingStateService);

  watchlistWithMovies$: Observable<WatchlistWithMovies>;

  eyeIcon = faEye;

  ngOnInit() {
    this.getMoviesFromWatchlist();
  }

  getMoviesFromWatchlist() {
    this.watchlistWithMovies$ = this.watchlistService.watchlist$;
  }

  removeMovieFromWatchList(movie: Movie, watchlist: Watchlist) {
    this.watchlistService.removeMovieFromWatchlist(movie, watchlist);
  }

  displayOverallRating(movieId: number): Observable<number> {
    return this.movieRatingService.getOverallRatingForMovie(movieId);
  }
}
