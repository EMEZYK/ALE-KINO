import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { Observable } from 'rxjs';

import { Movie } from '../../movies/movie.interface';
import { MovieActions } from '../../movies/store/movie.actions';
import * as movieSelectors from '../../movies/store/movie.selectors';

@Component({
  selector: 'app-admin-panel-page',
  templateUrl: './admin-panel-page.component.html',
  styleUrls: ['./admin-panel-page.component.css'],
  standalone: true,
  imports: [NgIf, AsyncPipe, NgFor],
})
export class AdminPanelPageComponent implements OnInit {
  private store = inject(Store);

  allMovies$: Observable<Movie[]>;

  ngOnInit(): void {
    this.allMovies$ = this.store.select(movieSelectors.selectAllMovies);

    this.loadMovies();
  }

  loadMovies(): void {
    this.store.dispatch(MovieActions.getMovies());
  }
}
