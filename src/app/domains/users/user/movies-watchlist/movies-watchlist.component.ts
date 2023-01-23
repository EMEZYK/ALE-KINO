import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from 'src/app/domains/movies/movie.interface';
import { MoviesWatchlistStateService } from './movies-watchlist.service';

@Component({
  selector: 'app-movies-to-watch',
  templateUrl: './movies-watchlist.component.html',
  styleUrls: ['./movies-watchlist.component.css'],
})
export class MoviesToWatchComponent implements OnInit {
  watchlist: Observable<Movie[]>;

  private watchlistService = inject(MoviesWatchlistStateService);

  ngOnInit() {
    this.getMoviesFromWatchlist();
    console.log(this.watchlist);
  }

  getMoviesFromWatchlist() {
    this.watchlist = this.watchlistService.watchlist$;
  }
}
