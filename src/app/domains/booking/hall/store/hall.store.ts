import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { Hall } from '../hall.interface';
import { HallApiService } from './hall.api.service';

export interface HallState {
  halls: Hall[];
}

@Injectable({
  providedIn: 'root',
})
export class HallStore extends ComponentStore<HallState> {
  private hallService = inject(HallApiService);
  private store = inject(Store);

  constructor() {
    super({
      halls: [],
    });
  }

  readonly getHalls = this.effect(() => {
    return this.hallService
      .getHalls()
      .pipe(map((halls) => this.patchState({ halls })));
  });
}
