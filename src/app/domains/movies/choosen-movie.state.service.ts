import { Injectable } from '@angular/core';
import { ChoosenMovieShowing } from './movie.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChoosenMovieShowingStateService {
  private choosenMovie$$ = new BehaviorSubject<ChoosenMovieShowing>(null);

  get chosenMovieShowing$() {
    return this.choosenMovie$$.asObservable();
  }

  constructor() {
    const storedShowing = localStorage.getItem('storedChoosenShowing');
    if (storedShowing !== '')
      this.setChoosenMovieShowing(JSON.parse(storedShowing), false);
  }

  setChoosenMovieShowing(
    choosenShowing: ChoosenMovieShowing,
    showingIsStored = true
  ) {
    if (showingIsStored)
      localStorage.setItem(
        'storedChoosenShowing',
        JSON.stringify(choosenShowing)
      );

    this.choosenMovie$$.next(choosenShowing);
  }
}
