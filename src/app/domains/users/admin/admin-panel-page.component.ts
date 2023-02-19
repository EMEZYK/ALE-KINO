import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Movie } from '../../movies/movie.interface';
import { MovieActions } from '../../movies/store/repertoire.actions';
import * as movieSelectors from '../../movies/store/repertoire.selectors';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel-page',
  templateUrl: './admin-panel-page.component.html',
  styleUrls: ['./admin-panel-page.component.css'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgFor,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
})
export class AdminPanelPageComponent implements OnInit {
  private store = inject(Store);

  selectedValue: Movie;
  allMovies$: Observable<Movie[]>;

  ngOnInit(): void {
    this.allMovies$ = this.store.select(movieSelectors.selectAllMovies);

    this.loadMovies();

    this.allMovies$
      .pipe(tap((movies: Movie[]) => (this.selectedValue = movies[0])))
      .subscribe();
  }

  loadMovies(): void {
    this.store.dispatch(MovieActions.getMovies());
  }
}
