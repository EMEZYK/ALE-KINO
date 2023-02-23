import { inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { map, Observable, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs';

import { Showing } from '../../movie.interface';
import { ShowingApiService } from './showing.api.service';

export interface ShowingsState {
  showings: Showing[];
}

export class ShowingsStore extends ComponentStore<ShowingsState> {
  private showingsService = inject(ShowingApiService);
  private store = inject(Store);

  constructor() {
    super({
      showings: [],
    });
  }

  readonly getAllShowings = this.effect(() => {
    return this.showingsService
      .getShowings()
      .pipe(map((showings) => this.patchState({ showings })));
  });

  readonly addShowing = this.effect((showing$: Observable<Showing>) => {
    return showing$.pipe(
      switchMap((showing) => this.showingsService.addShowing(showing)),
      tapResponse(
        ({ res }) => {
          this.patchState({ showings: [...this.get().showings, res] });
        },
        catchError((error) => {
          return of(error);
        })
      )
    );
  });
}
