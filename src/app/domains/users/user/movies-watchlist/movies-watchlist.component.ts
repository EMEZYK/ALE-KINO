import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  MoviesWatchlistStateService,
  WatchlistWithMovies,
} from './movies-watchlist.service';

@Component({
  selector: 'app-movies-to-watch',
  templateUrl: './movies-watchlist.component.html',
  styleUrls: ['./movies-watchlist.component.css'],
})
export class MoviesToWatchComponent implements OnInit {
  watchlistWithMovies$: Observable<WatchlistWithMovies>;

  private watchlistService = inject(MoviesWatchlistStateService);

  ngOnInit() {
    this.getMoviesFromWatchlist();
  }

  getMoviesFromWatchlist() {
    this.watchlistWithMovies$ = this.watchlistService.watchlist$;
  }
}
