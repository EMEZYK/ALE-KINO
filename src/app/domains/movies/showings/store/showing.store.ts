import { inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { map } from 'rxjs';

import { Showing } from '../../movie.interface';
import { ShowingApiService } from './showing.api.service';

export interface ShowingsState {
  showings: Showing[];
}

export class ShowingsStore extends ComponentStore<ShowingsState> {
  private showingsService = inject(ShowingApiService);

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
}
